import { useState, useEffect } from 'react'
import api from '@/services/api'
import { PostCard } from '@/components/blog/PostCard'

export function Home() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    api.get('/posts', { params: { page_size: 5 } }).then((res) => setPosts(res.data.items))
  }, [])

  return (
    <div>
      <section className="text-center py-20">
        <h1 className="text-5xl text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}>
          欢迎来到 Hety 的个人主页
        </h1>
        <p className="text-lg text-stone-400 italic">技术、思考与生活。</p>
      </section>

      {posts.length > 0 && (
        <section className="mt-4">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              id={p.id}
              title={p.title}
              summary={p.summary}
              coverImage={p.cover_image}
              tags={p.tags}
              createdAt={p.created_at}
              commentCount={p.comment_count}
              likeCount={p.like_count}
              viewCount={p.view_count}
            />
          ))}
        </section>
      )}
    </div>
  )
}
