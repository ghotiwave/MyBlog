import { useState, useEffect } from 'react'
import api from '@/services/api'

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    api.get('/admin/users').then((res) => setUsers(res.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该用户？')) return
    try {
      await api.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (e: any) {
      alert(e?.response?.data?.detail || '操作失败')
    }
  }

  if (loading) return <div className="text-center text-[var(--color-text-muted)] py-12">加载中...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">用户管理</h1>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] px-4 py-3">
            <div className="flex items-center gap-4">
              {u.avatar_url ? (
                <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                  {u.username[0]}
                </div>
              )}
              <div>
                <span className="font-medium text-sm text-[var(--color-text)]">{u.username}</span>
                {u.signature && <p className="text-[10px] text-[var(--color-text-muted)] truncate max-w-[200px]">{u.signature}</p>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {u.role === 'admin' ? '管理员' : '用户'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--color-text-muted)]">{new Date(u.created_at).toLocaleDateString('zh-CN')}</span>
              {u.role !== 'admin' && (
                <button onClick={() => handleDelete(u.id)} className="text-xs text-red-400 hover:text-red-500 cursor-pointer">
                  删除
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
