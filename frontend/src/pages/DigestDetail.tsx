import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import 'katex/dist/katex.min.css'
import api from '@/services/api'
import { ArticleLayout } from '@/components/blog/ArticleLayout'
import { Button } from '@/components/ui/Button'

interface Digest {
  id: number; title: string; topic: string; content: string
  source_urls: string | null; created_at: string
}

/** Split markdown into sections by ## headings for newspaper grid */
function splitSections(md: string): { heading: string; body: string; isSpotlight: boolean }[] {
  const sections: { heading: string; body: string; isSpotlight: boolean }[] = []
  const lines = md.split('\n')
  let currentHeading = ''
  let currentBody: string[] = []

  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (currentBody.length || currentHeading) {
        sections.push({
          heading: currentHeading,
          body: currentBody.join('\n').trim(),
          isSpotlight: currentHeading.includes('特别关注') || currentHeading.includes('🔥'),
        })
      }
      currentHeading = line.replace(/^#+\s*/, '')
      currentBody = []
    } else {
      currentBody.push(line)
    }
  }
  if (currentBody.length || currentHeading) {
    sections.push({
      heading: currentHeading,
      body: currentBody.join('\n').trim(),
      isSpotlight: currentHeading.includes('特别关注') || currentHeading.includes('🔥'),
    })
  }
  return sections
}

export function DigestDetail() {
  const { id } = useParams<{ id: string }>()
  const [digest, setDigest] = useState<Digest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/digests/${id}`).then((res) => setDigest(res.data)).finally(() => setLoading(false))
  }, [id])

  const sections = useMemo(() => (digest ? splitSections(digest.content) : []), [digest])
  // First two sections (title area + spotlight) get full width
  const headlineSections = sections.slice(0, 2)
  const gridSections = sections.slice(2)

  if (loading) return <div className="text-center text-[var(--color-text-muted)] py-12">加载中...</div>
  if (!digest) return <div className="text-center text-[var(--color-text-muted)] py-12">日报未找到。</div>

  return (
    <ArticleLayout content={digest.content}>
      <div className="max-w-5xl mx-auto">
        <Link to="/digest">
          <Button variant="ghost" size="sm" className="mb-4">← 返回</Button>
        </Link>

        {/* Newspaper masthead */}
        <header className="mb-8 pb-6 border-b-2 border-[var(--color-text)]">
          <h1 className="text-2xl md:text-3xl text-[var(--color-text)] font-bold tracking-tight mb-1">
            {digest.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <span>{digest.topic}</span>
            <span className="w-px h-3 bg-[var(--color-border)]" />
            <span>{new Date(digest.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* Spotlight sections — full width */}
        {headlineSections.map((s, i) => (
          <section key={i} className={`mb-6 pb-6 ${i < headlineSections.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-3 flex items-center gap-1">
              {s.heading}
            </h2>
            <div className="prose max-w-none columns-1 md:columns-2 gap-6">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeSlug]}>
                {s.body}
              </ReactMarkdown>
            </div>
          </section>
        ))}

        {/* Grid sections — 3-column newspaper layout */}
        {gridSections.length > 0 && (
          <>
            <div className="w-full h-px bg-[var(--color-text)]/20 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridSections.map((s, i) => (
                <section
                  key={i}
                  className={`p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]/50 ${
                    s.isSpotlight ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <h3 className="text-sm font-bold text-[var(--color-text)] mb-2 pb-2 border-b border-[var(--color-border)]/60">
                    {s.heading}
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeSlug]}>
                      {s.body}
                    </ReactMarkdown>
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        {/* Sources */}
        {digest.source_urls && (() => {
          try {
            const urls: string[] = JSON.parse(digest.source_urls)
            if (urls.length === 0) return null
            return (
              <div className="mt-10 pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-xs text-[var(--color-text-muted)] tracking-[0.2em] mb-2">来源</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                  {urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] truncate transition-colors">
                      {url}
                    </a>
                  ))}
                </div>
              </div>
            )
          } catch { return null }
        })()}
      </div>
    </ArticleLayout>
  )
}
