import { useState, useEffect } from 'react'
import api from '@/services/api'

export function AdminComments() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = () => {
    api.get('/admin/comments').then((res) => setComments(res.data.items)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchComments() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此评论？')) return
    await api.delete(`/admin/comments/${id}`)
    fetchComments()
  }

  if (loading) return <div className="text-center text-[var(--color-text-muted)] py-12">加载中...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">评论管理</h1>
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-[var(--color-text)]">{c.author_name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">评论于</span>
                <span className="text-sm text-[var(--color-primary)]">{c.post_title}</span>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:text-red-500 cursor-pointer">
                删除
              </button>
            </div>
            <p className="text-sm text-[var(--color-text)]">{c.content}</p>
            <span className="text-xs text-[var(--color-text-muted)]">{new Date(c.created_at).toLocaleString('zh-CN')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
