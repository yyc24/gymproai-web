'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// 连接 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Member = { id: string; name: string | null }

export default function Home() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    supabase.from('users').select('*').then(({ data }) => {
      setMembers((data as Member[]) ?? [])
    })
  }, [])

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minHeight: '100vh', justifyContent: 'center', background: '#000', color: '#fff' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>会员列表</h1>

      {members.length === 0 ? (
        <p>暂无会员数据</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {members.map((m) => (
            <li key={m.id} style={{ background: '#111', padding: '8px 16px', marginBottom: 8, borderRadius: 6 }}>
              {m.name ?? '未命名'}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
