'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
// 连接 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Member = { id: string; name: string | null }

export default function Home() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    supabase
      .from('users')
      .select('*')
      .then(({ data }) => setMembers((data as Member[]) ?? []))
  }, [])

 return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">

      {/* ① 标题 */}
      <h1 className="text-3xl font-bold">会员列表</h1>

      {/* ② 新增按钮 —— 就插在标题下方 */}
      <Link
        href="/members/new"
        className="text-blue-400 hover:underline mb-4"
      >
        ➕ 新增会员
      </Link>

      {/* ③ 列表或占位文案 */}
      {members.length === 0 ? (
        <p>暂无会员数据</p>
      ) : (
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.id} className="bg-neutral-900 px-4 py-2 rounded">
              {m.name ?? '未命名'}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}