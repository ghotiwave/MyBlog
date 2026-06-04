import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'

interface Digest {
  id: number
  title: string
  topic: string
  created_at: string
}

export function Digest() {
  const [digests, setDigests] = useState<Digest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/digests', { params: { page_size: 20 } })
      .then((res) => setDigests(res.data.items))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center text-[var(--color-text-muted)] py-12">加载中...</div>

  return (
    <div>
      <h1 className="text-2xl text-[var(--color-text)] mb-2 font-light tracking-wide">AI 日报</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">每日 AI 行业动态，自动生成。</p>
      {digests.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-center py-12">暂无日报。</p>
      ) : (
        <div>
          {digests.map((d) => (
            <Link key={d.id} to={`/digest/${d.id}`} className="block py-4 border-b border-[var(--color-border)]/60 hover:bg-[var(--color-surface)]/50 transition-colors px-2 -mx-2">
              <h3 className="text-base text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors font-normal">{d.title}</h3>
              <span className="text-xs text-[var(--color-text-muted)]">{new Date(d.created_at).toLocaleDateString('zh-CN')}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
