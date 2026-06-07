import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'

export function UserHistory() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/user/history').then((res) => setItems(res.data.items)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center text-[var(--color-text-muted)] py-12 italic">加载中...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl text-[var(--color-text)] mb-8" style={{ fontFamily: 'Georgia, serif' }}>阅读历史</h1>
      {items.length === 0 ? (
        <p className="text-[var(--color-text-muted)] italic text-center py-12">暂无阅读记录</p>
      ) : (
        <div>
          {items.map((item, i) => (
            <Link key={i} to={`/blog/${item.post_id}`} className="block group py-3 border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors px-2 -mx-2 rounded">
              <h3 className="text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{item.title}</h3>
              <span className="text-xs text-[var(--color-text-muted)] italic">{new Date(item.visited_at).toLocaleString('zh-CN')}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
