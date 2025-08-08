'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type User = {
  id: string
  name: string | null
  gender?: string
  birth_date?: string
  phone?: string
}

export default function EditMember() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // ① 拉取初始数据
  useEffect(() => {
    supabase.from('users').select('*').eq('id', id).single()
      .then(({ data }) => setUser(data as User))
  }, [id])

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        加载中…
      </main>
    )
  }

  // ② 保存
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: user.name,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
    }

    const { error } = await supabase.from('users').update(payload).eq('id', id)
    setLoading(false)

    if (error) {
      // 23505 = unique_violation
      if (error.code === '23505') {
        if (error.message.includes('phone')) {
          alert('电话号码已存在，请重新输入')
        } else if (error.message.includes('email')) {
          alert('邮箱已存在，请重新输入')
        } else {
          alert('唯一性冲突：' + error.message)
        }
      } else {
        alert('保存失败：' + error.message)
      }
      return
    }

    router.push(`/members/${id}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">编辑会员资料</h1>

      <form onSubmit={handleSave} className="space-y-4 w-64">

        {/* 姓名 */}
        <div>
          <label className="block mb-1">姓名</label>
          <input
            value={user.name ?? ''}
            onChange={e => setUser({ ...user!, name: e.target.value })}
            className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700 outline-none"
          />
        </div>

        {/* 性别 */}
        <div>
          <label className="block mb-1">性别</label>
          <select
            value={user.gender ?? ''}
            onChange={e => setUser({ ...user!, gender: e.target.value })}
            className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700 outline-none"
          >
            <option value="">— 请选择 —</option>
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="保密">保密</option>
          </select>
        </div>

        {/* 生日 */}
        <div>
          <label className="block mb-1">生日</label>
          <input
            type="date"
            value={user.birth_date ?? ''}
            onChange={e => setUser({ ...user!, birth_date: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700 outline-none"
          />
        </div>

        {/* 联系电话 */}
        <div>
          <label className="block mb-1">联系电话</label>
          <input
            value={user.phone ?? ''}
            onChange={e => setUser({ ...user!, phone: e.target.value })}
            className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700 outline-none"
          />
        </div>

        {/* 保存按钮 */}
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
