import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

interface TOCItem { id: string; text: string; level: number }

interface Props {
  content: string
  prevPost?: { id: number; title: string } | null
  nextPost?: { id: number; title: string } | null
  children: React.ReactNode
}

function extractTOC(md: string): TOCItem[] {
  const items: TOCItem[] = []
  for (const line of md.split('\n')) {
    const m = line.match(/^(#{2,4})\s+(.+)/)
    if (m) {
      const text = m[2].replace(/[`*_~\[\]()#]+/g, '').trim()
      items.push({ id: text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, ''), text, level: m[1].length })
    }
  }
  return items
}

export function ArticleLayout({ content, prevPost, nextPost, children }: Props) {
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const toc = useMemo(() => extractTOC(content), [content])

  return (
    <div className="flex gap-6 relative">
      {/* Left sidebar toggle */}
      <button
        onClick={() => setShowLeft(!showLeft)}
        className="fixed left-4 top-24 z-50 w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors flex items-center justify-center"
        title="文章导航"
      >
        ←
      </button>

      {/* Left sidebar */}
      {showLeft && (
        <aside className="fixed left-16 top-24 z-50 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-left-2">
          <h4 className="text-xs text-[var(--color-text-muted)] tracking-wider mb-3">文章导航</h4>
          <div className="space-y-3">
            {prevPost ? (
              <Link to={`/blog/${prevPost.id}`} className="block group" onClick={() => setShowLeft(false)}>
                <span className="text-[10px] text-[var(--color-text-muted)]">← 上一篇</span>
                <p className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mt-0.5 line-clamp-2">{prevPost.title}</p>
              </Link>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">没有了</p>
            )}
            {nextPost ? (
              <Link to={`/blog/${nextPost.id}`} className="block group" onClick={() => setShowLeft(false)}>
                <span className="text-[10px] text-[var(--color-text-muted)]">下一篇 →</span>
                <p className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mt-0.5 line-clamp-2">{nextPost.title}</p>
              </Link>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">没有了</p>
            )}
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* Right sidebar toggle */}
      {toc.length > 0 && (
        <>
          <button
            onClick={() => setShowRight(!showRight)}
            className="fixed right-4 top-24 z-50 w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors flex items-center justify-center"
            title="目录"
          >
            ☰
          </button>

          {showRight && (
            <aside className="fixed right-16 top-24 z-50 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-right-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <h4 className="text-xs text-[var(--color-text-muted)] tracking-wider mb-3">目录</h4>
              <div className="border-l-2 border-[var(--color-border)] pl-3 space-y-1">
                {toc.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors truncate block py-0.5"
                    style={{ paddingLeft: (item.level - 2) * 10 }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </aside>
          )}
        </>
      )}
    </div>
  )
}
