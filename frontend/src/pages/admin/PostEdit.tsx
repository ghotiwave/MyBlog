import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '@/services/api'
import { PostForm } from '@/components/admin/PostForm'

export function PostEdit() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (id) {
      api.get(`/admin/posts/${id}`).then((res) => {
        setPost(res.data)
      }).finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {post ? 'Edit Post' : 'New Post'}
      </h1>
      <PostForm post={post} />
    </div>
  )
}
