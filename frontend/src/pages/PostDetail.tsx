import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '@/services/api'
import { CommentSection } from '@/components/blog/CommentSection'

interface Post {
  id: number
  title: string
  content: string
  cover_image: string | null
  created_at: string
  comment_count: number
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => {
      setPost(res.data)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>
  if (!post) return <div className="text-center text-gray-400 py-12">Post not found.</div>

  return (
    <article className="max-w-3xl mx-auto">
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-8">
        {new Date(post.created_at).toLocaleDateString('zh-CN')}
      </p>
      <div className="prose max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <CommentSection postId={post.id} />
    </article>
  )
}
