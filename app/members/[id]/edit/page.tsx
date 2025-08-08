'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type User = { id: string; name: string | null; gender?: string; birth_date?: string; phone?: string }

export default function EditMember() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // 取初始资料
  useEffect(() => {
    supabase.from('users').select('*').eq('id', id).single()
      .then(({ data }) => setUser(data as User))
  }, [id])

  if (!user) return <main className="min-h-screen flex items-center justify-center text-white">加载中…</main>

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('users').update({
      name: user.name,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone
    }).eq('id', id)
    setLoading(false)
    if (error) alert(error.message)
    else router.push(`/members/${id}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">编辑会员资料</h1>

      <form onSubmit={handleSave} className="space-y-4 w-64">
        {[
          { label: '姓名', key: 'name' },
          { label: '性别', key: 'gender' },
          { label: '生日(YYYY-MM-DD)', key: 'birth_date' },
          { label: '联系电话', key: 'phone' }
        ].map(f => (
          <div key={f.key}>
            <label className="block mb-1">{f.label}</label>
            <input
              value={(user as any)[f.key] ?? ''}
              onChange={e => setUser({ ...user!, [f.key]: e.target.value })}
              className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700 outline-none"
            />
          </div>
        ))}

        <button
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? '保存中…' : '保存'}
        </button>
      </form>
    </main>
  )
}
