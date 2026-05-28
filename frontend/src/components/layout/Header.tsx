import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
            MyBlog
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
            <Link to="/game" className="text-gray-600 hover:text-gray-900 transition-colors">Game</Link>
            <Link to="/digest" className="text-gray-600 hover:text-gray-900 transition-colors">Digest</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500">{user.username}</span>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
                  Admin
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
