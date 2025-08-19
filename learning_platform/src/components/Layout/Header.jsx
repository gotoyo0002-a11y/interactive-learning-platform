import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAuthStore } from '../../stores/authStore'
import {
  BookOpen,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const baseNavigation = [
    { name: '首頁', href: '/' },
    { name: '課程', href: '/courses' },
  ]

  let roleSpecificNavigation = []
  if (profile?.role === 'student') {
    roleSpecificNavigation = [
      { name: '我的課程', href: '/my-courses' },
      { name: '作業中心', href: '/assignments' },
    ]
  } else if (profile?.role === 'teacher') {
    roleSpecificNavigation = [
      { name: '我的課程', href: '/my-courses' },
      { name: '課程管理', href: '/teacher/course-management' },
      { name: '作業中心', href: '/assignments' },
    ]
  } else if (profile?.role === 'admin') {
    roleSpecificNavigation = [
      { name: '儀表板', href: '/admin/dashboard' },
      { name: '使用者管理', href: '/admin/user-management' },
      { name: '課程管理', href: '/admin/course-management' },
      { name: '我的課程', href: '/my-courses' },
      { name: '作業中心', href: '/assignments' },
    ]
  }

  const navigation = user ? [...baseNavigation, ...roleSpecificNavigation] : baseNavigation

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                互動式教學平台
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.first_name} />
                      <AvatarFallback>
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      個人資料
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-courses" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      我的課程
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to='/admin/dashboard' className='flex items-center'>
                        <Settings className='mr-2 h-4 w-4' />
                        儀表板
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(profile?.role === 'admin' || profile?.role === 'teacher') && (
                    <DropdownMenuItem asChild>
                      <Link to='/admin/course-management' className='flex items-center'>
                        <BookOpen className='mr-2 h-4 w-4' />
                        課程管理
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to='/admin/user-management' className='flex items-center'>
                        <User className='mr-2 h-4 w-4' />
                        使用者管理
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">登錄</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">註冊</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}


