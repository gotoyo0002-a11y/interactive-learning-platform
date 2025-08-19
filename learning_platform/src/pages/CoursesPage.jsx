import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useCourseStore } from '../stores/courseStore'
import { useAuthStore } from '../stores/authStore'
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  Search,
  Filter,
  Play
} from 'lucide-react'
import '../App.css'

export function CoursesPage() {
  const { courses, fetchCourses, loading, enrollCourse } = useCourseStore()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    let filtered = courses

    // 搜索過濾
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 分類過濾
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter)
    }

    // 難度過濾
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(course => course.difficulty_level === difficultyFilter)
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, categoryFilter, difficultyFilter])

  const handleEnroll = async (courseId) => {
    if (!user) {
      // 重定向到登錄頁面
      return
    }

    const result = await enrollCourse(courseId, user.id)
    if (result.success) {
      alert('選課成功！')
    } else {
      alert('選課失敗：' + result.error)
    }
  }

  const categories = [...new Set(courses.map(course => course.category))].filter(Boolean)
  const difficulties = ['beginner', 'intermediate', 'advanced']

  const difficultyLabels = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '高級'
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            探索課程
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            發現適合您的學習課程，開始您的技能提升之旅
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索課程..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分類</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇難度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有難度</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficultyLabels[difficulty]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到課程</h3>
            <p className="text-gray-600">請嘗試調整搜索條件或過濾器</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <Card key={course.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary">
                      {course.category}
                    </Badge>
                    <Badge variant="outline">
                      {difficultyLabels[course.difficulty_level] || course.difficulty_level}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                  {course.user_profiles && (
                    <div className="text-sm text-gray-600">
                      講師：{course.user_profiles.first_name} {course.user_profiles.last_name}
                    </div>
                  )}
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
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/courses/${course.id}`}>
                          詳情
                        </Link>
                      </Button>
                      {user && (
                        <Button 
                          size="sm" 
                          onClick={() => handleEnroll(course.id)}
                        >
                          選課
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredCourses.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              顯示 {filteredCourses.length} 個課程，共 {courses.length} 個課程
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

