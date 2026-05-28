import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { PostCard } from '@/components/blog/PostCard'
import { Button } from '@/components/ui/Button'

export function Home() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    api.get('/posts', { params: { page_size: 3 } }).then((res) => setPosts(res.data.items))
  }, [])

  return (
    <div>
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MyBlog
        </h1>
        <p className="text-lg text-gray-500 mb-6 max-w-md mx-auto">
          A personal space for sharing thoughts, ideas, and stories.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/blog">
            <Button size="lg">Read Blog</Button>
          </Link>
          <Link to="/about">
            <Button variant="secondary" size="lg">About Me</Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          <Link to="/blog" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {posts.map((p) => (
              <PostCard key={p.id} {...p} coverImage={p.cover_image} createdAt={p.created_at} commentCount={p.comment_count} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
