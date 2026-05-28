import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Props {
  id: number
  title: string
  summary: string | null
  coverImage: string | null
  createdAt: string
  commentCount: number
}

export function PostCard({ id, title, summary, coverImage, createdAt, commentCount }: Props) {
  return (
    <Link to={`/blog/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-40 object-cover rounded-t-xl"
          />
        )}
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
          {summary && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{summary}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{new Date(createdAt).toLocaleDateString('zh-CN')}</span>
            <Badge>{commentCount} comments</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
