import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useCourseStore } from '../stores/courseStore'
import { useAuthStore } from '../stores/authStore'
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp,
  ArrowRight,
  Play,
  Clock,
  Star
} from 'lucide-react'
import '../App.css'

export function HomePage() {
  const { courses, fetchCourses, loading } = useCourseStore()
  const { user } = useAuthStore()
  const [featuredCourses, setFeaturedCourses] = useState([])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    if (courses.length > 0) {
      // 取前 3 個課程作為推薦課程
      setFeaturedCourses(courses.slice(0, 3))
    }
  }, [courses])

  const stats = [
    {
      icon: BookOpen,
      label: '課程總數',
      value: courses.length,
      color: 'text-primary'
    },
    {
      icon: Users,
      label: '學習者',
      value: '1,000+',
      color: 'text-secondary'
    },
    {
      icon: Award,
      label: '完成證書',
      value: '500+',
      color: 'text-accent'
    },
    {
      icon: TrendingUp,
      label: '滿意度',
      value: '98%',
      color: 'text-primary'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              開啟您的
              <span className="block text-yellow-300">學習之旅</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              探索豐富的線上課程，與專業講師互動學習，
              獲得實用技能，實現您的職業目標
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/courses" className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  瀏覽課程
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                  <Link to="/register" className="flex items-center">
                    立即註冊
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              推薦課程
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              精選優質課程，幫助您快速掌握新技能
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <Card key={course.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                    <Badge className="absolute top-4 left-4" variant="secondary">
                      {course.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.max_students} 人</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>8 週</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.id}`}>
                          查看詳情
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/courses" className="flex items-center">
                查看所有課程
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              為什麼選擇我們
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我們提供最優質的線上學習體驗
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">豐富課程</h3>
              <p className="text-gray-600">
                涵蓋多個領域的專業課程，滿足不同學習需求
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">互動學習</h3>
              <p className="text-gray-600">
                與講師和同學實時互動，提升學習效果
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">認證證書</h3>
              <p className="text-gray-600">
                完成課程後獲得專業認證，提升職業競爭力
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              準備開始學習了嗎？
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              立即註冊，開始您的學習之旅，解鎖無限可能
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/register" className="flex items-center">
                免費註冊
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

