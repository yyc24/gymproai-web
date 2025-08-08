'use client'

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function MemberDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

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
