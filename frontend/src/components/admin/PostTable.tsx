import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Post {
  id: number
  title: string
  published: boolean
  created_at: string
  comment_count: number
}

interface Props {
  posts: Post[]
  onDelete: (id: number) => void
}

export function PostTable({ posts, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Title</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Comments</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-900">{p.title}</td>
              <td className="py-3 px-4">
                <Badge className={p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                  {p.published ? 'Published' : 'Draft'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-gray-500">{new Date(p.created_at).toLocaleDateString('zh-CN')}</td>
              <td className="py-3 px-4 text-gray-500">{p.comment_count}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/admin/posts/${p.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => onDelete(p.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
