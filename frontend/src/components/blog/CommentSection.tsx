import { useState, useEffect } from 'react'
import api from '@/services/api'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface Comment {
  id: number
  author_name: string
  content: string
  created_at: string
}

export function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = () => {
    api.get(`/posts/${postId}/comments`).then((res) => setComments(res.data))
  }

  useEffect(() => { fetchComments() }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim()) return
    setSubmitting(true)
    try {
      await api.post(`/posts/${postId}/comments`, {
        author_name: authorName.trim(),
        content: content.trim(),
      })
      setAuthorName('')
      setContent('')
      fetchComments()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <Input
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm text-gray-900">{c.author_name}</span>
              <span className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <p className="text-sm text-gray-600">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
