import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { PostTable } from '@/components/admin/PostTable'
import { Button } from '@/components/ui/Button'

export function PostManage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = () => {
    api.get('/admin/posts', { params: { page_size: 50 } }).then((res) => {
      setPosts(res.data.items)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这篇文章？')) return
    await api.delete(`/admin/posts/${id}`)
    fetchPosts()
  }

  if (loading) return <div className="text-center text-[var(--color-text-muted)] py-12">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">文章管理</h1>
        <Link to="/admin/posts/new">
          <Button>新文章</Button>
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-center py-12">暂无文章</p>
      ) : (
        <PostTable posts={posts} onDelete={handleDelete} />
      )}
    </div>
  )
}
