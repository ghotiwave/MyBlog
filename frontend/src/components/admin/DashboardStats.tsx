import { Card, CardContent } from '@/components/ui/Card'

interface Props {
  stats: { total_posts: number; published_posts: number; total_comments: number; total_users: number } | null
}

export function DashboardStats({ stats }: Props) {
  if (!stats) return null
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Total Posts', value: stats.total_posts },
        { label: 'Published', value: stats.published_posts },
        { label: 'Comments', value: stats.total_comments },
        { label: 'Users', value: stats.total_users },
      ].map((s) => (
        <Card key={s.label}>
          <CardContent className="text-center">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
