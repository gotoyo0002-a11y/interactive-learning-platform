import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { useCourseStore } from '../../stores/courseStore'
import { supabase } from '../../lib/supabase'
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  Bell,
  Activity,
  Calendar,
  FileText
} from 'lucide-react'
import '../../App.css'

export function AdminDashboard() {
  const { courses, fetchCourses } = useCourseStore()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    totalAssignments: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
    fetchStats()
    fetchRecentActivities()
  }, [fetchCourses])

  const fetchStats = async () => {
    try {
      // 獲取課程總數
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })

      // 獲取用戶總數
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // 獲取選課總數
      const { count: enrollmentsCount } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })

      // 獲取作業總數
      const { count: assignmentsCount } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalCourses: coursesCount || 0,
        totalUsers: usersCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        totalAssignments: assignmentsCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentActivities(data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: '新增課程',
      description: '創建新的課程',
      icon: Plus,
      href: '/admin/courses/create',
      color: 'text-primary'
    },
    {
      title: '用戶管理',
      description: '管理系統用戶',
      icon: Users,
      href: '/admin/users',
      color: 'text-secondary'
    },
    {
      title: '數據分析',
      description: '查看平台數據',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'text-accent'
    },
    {
      title: '系統設定',
      description: '配置系統設置',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-gray-600'
    }
  ]

  const statCards = [
    {
      title: '課程總數',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: '用戶總數',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: '選課總數',
      value: stats.totalEnrollments,
      icon: Award,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: '作業總數',
      value: stats.totalAssignments,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const getActionLabel = (action) => {
    const actionLabels = {
      'RESET_PASSWORD': '重置密碼',
      'DELETE_USER': '刪除用戶',
      'CREATE_COURSE': '創建課程',
      'UPDATE_COURSE': '更新課程',
      'DELETE_COURSE': '刪除課程'
    }
    return actionLabels[action] || action
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理員儀表板</h1>
          <p className="text-gray-600">歡迎回來，管理您的教學平台</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  快速操作
                </CardTitle>
                <CardDescription>
                  常用的管理功能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.href}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                          <action.icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    最近活動
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/activities">查看全部</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-sm">暫無活動記錄</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {getActionLabel(activity.action)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {activity.target_type}: {activity.target_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleString('zh-TW')}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.action}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="mt-8">
          <Card className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  最新課程
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/courses">管理課程</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-gray-500 text-sm">暫無課程</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant={course.is_published ? "default" : "outline"}>
                          {course.is_published ? "已發布" : "草稿"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

