'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'                 // ← 新增

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

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>()
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
  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        加载中…
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-3xl font-bold">{data.name ?? '未命名'}</h1>

      <div className="space-y-2">
        <p>性别：{data.gender ?? '—'}</p>
        <p>生日：{data.birth_date ?? '—'}</p>
        <p>联系电话：{data.phone ?? '—'}</p>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 mt-6">
        <Link
          href={`/members/${id}/edit`}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
        >
          编辑资料
        </Link>

        <button
          onClick={async () => {
            if (!confirm('确定删除该会员？此操作不可撤销！')) return
            await supabase.from('users').delete().eq('id', id)
            location.href = '/'        // 删除后回首页
          }}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
        >
          删除会员
        </button>
      </div>
    </main>
  )
}