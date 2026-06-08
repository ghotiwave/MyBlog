import { Link } from 'react-router-dom'

interface Props {
  id: number
  slug?: string | null
  title: string
  summary: string | null
  coverImage: string | null
  tags?: string | null
  createdAt: string
  commentCount: number
  likeCount?: number
  viewCount?: number
  activeTag?: string
  onTagClick?: (tag: string) => void
}

export function PostCard({ id, slug, title, summary, coverImage, tags, createdAt, commentCount, likeCount = 0, viewCount = 0, activeTag, onTagClick }: Props) {
  const tagList = (tags || '').split(',').map((t) => t.trim()).filter(Boolean)

  return (
    <Link to={`/blog/${slug || id}`} className="block group py-5 border-b border-[var(--color-border)]/60 hover:bg-[var(--color-surface)]/50 transition-colors px-2 -mx-2">
      <div className="flex gap-5">
        {coverImage && (
          <img src={coverImage} alt={title} className="w-24 h-24 object-cover rounded flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-1 leading-snug font-normal tracking-wide">
            {title}
          </h3>
          {summary && <p className="text-sm text-[var(--color-text-muted)] mb-2 line-clamp-2">{summary}</p>}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--color-text-muted)]">
              {new Date(createdAt).toLocaleDateString('zh-CN')} · {commentCount} 评论 · {likeCount} 赞 · {viewCount} 阅读
            </span>
            {tagList.length > 0 && tagList.map((tag) => (
              <span
                key={tag}
                onClick={(e) => { e.preventDefault(); onTagClick?.(tag) }}
                className={`px-2 py-0.5 text-[10px] cursor-pointer transition-colors ${
                  activeTag === tag
                    ? 'bg-[#8b7355] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
