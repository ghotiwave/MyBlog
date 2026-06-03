import { useState, useEffect, useMemo } from 'react'
import api from '@/services/api'
import ForceGraph2D from 'react-force-graph-2d'

interface Props {
  currentPostId?: number
  onClose: () => void
}

export function GraphModal({ currentPostId, onClose }: Props) {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    api.get('/posts', { params: { page_size: 100 } }).then((res) => setPosts(res.data.items))
  }, [])

  const graphData = useMemo(() => {
    const nodes: any[] = []
    const links: any[] = []
    const nodeMap = new Map<string, any>()

    posts.forEach((p) => {
      const tags = (p.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean)
      const isCurrent = p.id === currentPostId
      const nodeId = `post-${p.id}`
      const node = { id: nodeId, name: p.title, group: 'post', val: isCurrent ? 8 : 4, isCurrent }
      nodes.push(node)
      nodeMap.set(nodeId, node)

      tags.forEach((tag: string) => {
        const tagId = `tag-${tag}`
        if (!nodeMap.has(tagId)) {
          nodeMap.set(tagId, { id: tagId, name: tag, group: 'tag', val: 3, isCurrent: false })
          nodes.push(nodeMap.get(tagId))
        }
        links.push({ source: tagId, target: nodeId })
      })

      // Link posts sharing tags
      posts.forEach((other) => {
        if (other.id <= p.id) return
        const otherTags = (other.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean)
        if (tags.some((t: string) => otherTags.includes(t))) {
          links.push({ source: nodeId, target: `post-${other.id}` })
        }
      })
    })

    return { nodes, links }
  }, [posts, currentPostId])

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] h-[85vh] max-w-5xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-2xl cursor-pointer">&times;</button>
        <h2 className="text-lg text-stone-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Knowledge Graph
        </h2>
        {graphData.nodes.length > 0 && (
          <ForceGraph2D
            graphData={graphData}
            width={Math.min(window.innerWidth * 0.85, 900)}
            height={window.innerHeight * 0.7}
            nodeLabel="name"
            nodeColor={(n: any) => n.isCurrent ? '#ea580c' : n.group === 'tag' ? '#d97706' : '#78716c'}
            nodeVal={(n: any) => n.val}
            linkColor={() => '#e7e5e4'}
            nodeCanvasObject={(n: any, ctx: CanvasRenderingContext2D, scale: number) => {
              const r = n.val * 1.2
              ctx.beginPath(); ctx.arc(n.x!, n.y!, r, 0, 2 * Math.PI)
              ctx.fillStyle = n.isCurrent ? '#ea580c' : n.group === 'tag' ? '#d97706' : '#78716c'
              ctx.fill()
              if (scale > 1.5) {
                ctx.font = `${9 / scale}px system-ui`
                ctx.fillStyle = '#292524'; ctx.textAlign = 'center'
                ctx.fillText(n.name.slice(0, 18), n.x!, n.y! + r + 10 / scale)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
