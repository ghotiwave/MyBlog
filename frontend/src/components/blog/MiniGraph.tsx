import { useState, useEffect, useMemo, useRef } from 'react'
import api from '@/services/api'
import ForceGraph2D from 'react-force-graph-2d'

interface Props {
  currentPostId: number
  tags: string
  onExpand: () => void
}

export function MiniGraph({ currentPostId, tags, onExpand }: Props) {
  const [posts, setPosts] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 220, h: 180 })

  useEffect(() => {
    api.get('/posts', { params: { page_size: 100 } }).then((res) => setPosts(res.data.items))
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      setSize({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight })
    }
  }, [])

  const graphData = useMemo(() => {
    const currentTags = tags.split(',').map((t) => t.trim()).filter(Boolean)
    const relatedPosts = posts.filter((p) => {
      const pt = (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
      return pt.some((t) => currentTags.includes(t))
    })

    const nodes: any[] = [{ id: `post-${currentPostId}`, name: 'current', group: 'post', val: 6 }]
    const links: any[] = []

    currentTags.forEach((tag) => {
      nodes.push({ id: `tag-${tag}`, name: tag, group: 'tag', val: 3 })
      links.push({ source: `tag-${tag}`, target: `post-${currentPostId}` })
    })

    relatedPosts.forEach((p) => {
      if (p.id === currentPostId) return
      nodes.push({ id: `post-${p.id}`, name: p.title.slice(0, 10), group: 'post', val: 3 })
      const pt = (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
      const shared = pt.find((t) => currentTags.includes(t))
      if (shared) links.push({ source: `tag-${shared}`, target: `post-${p.id}` })
    })

    return { nodes, links }
  }, [posts, tags, currentPostId])

  if (graphData.nodes.length <= 1) return null

  return (
    <div className="border border-amber-200 rounded-xl bg-white overflow-hidden cursor-pointer relative group" onClick={onExpand}>
      <div ref={containerRef} className="w-full" style={{ height: 180 }}>
        <ForceGraph2D
          graphData={graphData}
          width={size.w}
          height={size.h}
          nodeLabel="name"
          nodeColor={(n: any) => n.group === 'tag' ? '#d97706' : '#78716c'}
          nodeVal={(n: any) => n.val}
          linkColor={() => '#e7e5e4'}
          enableZoom={false}
          enablePanDrag={false}
          enableNodeDrag={false}
          nodeCanvasObject={(n: any, ctx: CanvasRenderingContext2D) => {
            const r = n.val * 1.2
            ctx.beginPath(); ctx.arc(n.x!, n.y!, r, 0, 2 * Math.PI)
            ctx.fillStyle = n.group === 'tag' ? '#d97706' : '#78716c'
            ctx.fill()
          }}
        />
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] text-stone-300 group-hover:text-amber-600">
        related &rarr;
      </div>
    </div>
  )
}
