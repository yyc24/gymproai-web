'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewMember() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const { error } = await supabase.from('users').insert({ name })
    setLoading(false)
    if (error) alert(error.message)
    else router.push('/')          // 成功后回首页
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-3xl font-bold">新增会员</h1>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入会员姓名"
          className="w-60 px-4 py-2 rounded border border-neutral-700 bg-neutral-900 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? '保存中…' : '保存'}
        </button>
      </form>
    </main>
  )
}
