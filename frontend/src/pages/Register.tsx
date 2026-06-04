import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyUrl, setVerifyUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await register(username, email, password)
      if (result?.verify_url) setVerifyUrl(result.verify_url)
      navigate('/')
    } catch {
      setError('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto pt-12">
      <Card>
        <CardContent>
          <h1 className="text-2xl text-[#3a3a38] text-center mb-6 font-normal">注册</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="用户名" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {verifyUrl && (
              <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                注册成功！请点击验证链接激活账号：<br />
                <a href={verifyUrl} target="_blank" className="underline break-all">{verifyUrl}</a>
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>
          <p className="text-sm text-center text-[#b5b4af] mt-4">
            已有账号？ <Link to="/login" className="text-[#8b7355] hover:underline">登录</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
