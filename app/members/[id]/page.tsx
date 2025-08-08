'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { notFound, useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type User = { id: string; name: string | null; gender?: string; birth_date?: string; phone?: string }

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>()      // 从 URL 取 id
  const [data, setData] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('users').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data) setError('not-found')
        else setData(data as User)
      })
  }, [id])

  if (error) notFound()
  if (!data) return <main className="min-h-screen flex items-center justify-center bg-black text-white">加载中…</main>

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-3xl font-bold">{data.name ?? '未命名'}</h1>

      <div className="space-y-2">
        <p>性别：{data.gender ?? '—'}</p>
        <p>生日：{data.birth_date ?? '—'}</p>
        <p>联系电话：{data.phone ?? '—'}</p>
      </div>
    </main>
  )
}
