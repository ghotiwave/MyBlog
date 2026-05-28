import { useState, useEffect } from 'react'
import api from '@/services/api'
import { PostCard } from './PostCard'
import { Input } from '@/components/ui/Input'

interface Post {
  id: number
  title: string
  summary: string | null
  cover_image: string | null
  created_at: string
  comment_count: number
}

interface Props {
  search?: boolean
}

export function PostList({ search = true }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    api.get('/posts', { params: { page, q: q || undefined } })
      .then((res) => {
        setPosts(res.data.items)
        setTotalPages(res.data.total_pages)
      })
      .finally(() => setLoading(false))
  }, [page, q])

  return (
    <div>
      {search && (
        <Input
          placeholder="Search posts..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          className="mb-6"
        />
      )}
      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No posts yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                id={p.id}
                title={p.title}
                summary={p.summary}
                coverImage={p.cover_image}
                createdAt={p.created_at}
                commentCount={p.comment_count}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded text-sm cursor-pointer ${
                    page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
