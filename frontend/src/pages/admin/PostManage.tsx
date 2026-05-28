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
    if (!confirm('Delete this post?')) return
    await api.delete(`/admin/posts/${id}`)
    fetchPosts()
  }

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link to="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No posts yet.</p>
      ) : (
        <PostTable posts={posts} onDelete={handleDelete} />
      )}
    </div>
  )
}
