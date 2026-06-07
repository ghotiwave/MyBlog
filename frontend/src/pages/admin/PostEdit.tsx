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

  if (loading) return <div className="text-center text-[var(--color-text-muted)] py-12">加载中...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-8">
        {post ? '编辑文章' : '新文章'}
      </h1>
      <PostForm post={post} />
    </div>
  )
}
