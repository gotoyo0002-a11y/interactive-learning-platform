import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { useAuthStore } from '../stores/authStore'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import '../App.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn(email, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <GraduationCap className="h-12 w-12 text-primary" />
            <span className="text-2xl font-bold text-gray-900">互動式教學平台</span>
          </Link>
        </div>

        {/* Login Form */}
        <Card className="animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">登錄</CardTitle>
            <CardDescription className="text-center">
              輸入您的帳號資訊以登錄系統
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="請輸入您的電子郵件"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="請輸入您的密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  忘記密碼？
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? '登錄中...' : '登錄'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">或</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">
                  還沒有帳號？{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    立即註冊
                  </Link>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-lg">測試帳號</CardTitle>
            <CardDescription>
              您可以使用以下測試帳號登錄系統
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">學生帳號：</div>
              <div className="text-gray-600">student@example.com / password123</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">教師帳號：</div>
              <div className="text-gray-600">teacher@example.com / password123</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">管理員帳號：</div>
              <div className="text-gray-600">admin@example.com / password123</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

