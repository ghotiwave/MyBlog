import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { Button } from '@/components/ui/Button'

export function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/dashboard/stats').then((res) => setStats(res.data))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      <DashboardStats stats={stats} />
    </div>
  )
}
