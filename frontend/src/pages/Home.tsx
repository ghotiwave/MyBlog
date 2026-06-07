import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { PostCard } from '@/components/blog/PostCard'
import logoImg from '@/assets/logo.png'

interface Profile { github_url?: string | null; twitter_url?: string | null; qq?: string | null }

export function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [profile, setProfile] = useState<Profile>({})

  useEffect(() => {
    api.get('/posts', { params: { page_size: 5 } }).then((res) => setPosts(res.data.items))
    api.get('/profile').then((res) => setProfile(res.data)).catch(() => {})
  }, [])

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <section className="py-24 md:py-32 flex justify-center">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-2xl">
          <img src={logoImg} alt="Hety" className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-2xl shrink-0" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl text-[var(--color-text)] leading-snug mb-3 tracking-wide font-light">
              Hety 的个人主页
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-loose">
              技术、思考与生活。
            </p>
            {(profile.github_url || profile.twitter_url || profile.qq) && (
              <div className="flex items-center gap-4 mt-4">
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    title="GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
                {profile.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    title="X / Twitter">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {profile.qq && (
                  <a href={`https://wpa.qq.com/msgrd?v=3&uin=${profile.qq}&site=qq&menu=yes`} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    title="QQ">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.395 15.035a39.548 39.548 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a38.97 38.97 0 0 0-.802 2.264c-1.021 3.283-1.045 4.642 1.055 5.396.592.214 1.544.403 2.366.554.215 1.317.864 2.074 1.667 2.65.77.553 1.616.804 1.988.804.148 2.088 2.559 1.933 4.318 1.933s4.17.155 4.318-1.933c.372 0 1.218-.251 1.988-.804.803-.576 1.452-1.333 1.667-2.65.822-.151 1.774-.34 2.366-.554 2.1-.754 2.076-2.113 1.055-5.396zM12 1.876c3.307 0 5.476 2.123 5.476 5.074 0 .188-.011.48-.014.664l-.341.062c-.694-1.914-2.726-3.301-5.121-3.301s-4.427 1.387-5.121 3.301l-.341-.062c-.003-.184-.014-.476-.014-.664 0-2.951 2.169-5.074 5.476-5.074z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="border-t border-[var(--color-border)]/50 pt-10 pb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs text-[var(--color-text-muted)] tracking-[0.2em]">最近</h2>
            <Link to="/blog" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              全部 &rarr;
            </Link>
          </div>
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

      <div className="text-center py-10 border-t border-[var(--color-border)]/30 mt-auto">
        <p className="text-xs text-[var(--color-text-muted)]">感谢来访。</p>
      </div>
    </div>
  )
}
