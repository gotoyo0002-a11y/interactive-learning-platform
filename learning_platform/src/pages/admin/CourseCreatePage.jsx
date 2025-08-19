import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { useCourseStore } from '../../stores/courseStore'
import { useAuthStore } from '../../stores/authStore'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import '../../App.css'

export function CourseCreatePage() {
  const navigate = useNavigate()
  const { createCourse, loading } = useCourseStore()
  const { user } = useAuthStore()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty_level: '',
    max_students: '',
    start_date: '',
    end_date: '',
    course_code: '',
    is_published: false
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 驗證必填欄位
    if (!formData.title || !formData.description || !formData.difficulty_level) {
      setError('請填寫所有必填欄位')
      return
    }

    // 準備提交數據
    const courseData = {
      ...formData,
      teacher_id: user.id,
      max_students: parseInt(formData.max_students) || 50,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null
    }

    const result = await createCourse(courseData)
    
    if (result.success) {
      setSuccess('課程創建成功！')
      setTimeout(() => {
        navigate('/admin/courses')
      }, 2000)
    } else {
      setError(result.error)
    }
  }

  const categories = [
    '程式設計',
    '網頁開發',
    '數據科學',
    '人工智慧',
    '設計',
    '商業管理',
    '語言學習',
    '其他'
  ]

  const difficulties = [
    { value: 'beginner', label: '初級' },
    { value: 'intermediate', label: '中級' },
    { value: 'advanced', label: '高級' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin/courses')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回課程管理
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">創建新課程</h1>
          <p className="text-gray-600">填寫以下資訊來創建一個新的課程</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>基本資訊</CardTitle>
                  <CardDescription>課程的基本資訊和描述</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">課程標題 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="輸入課程標題"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="course_code">課程代碼</Label>
                    <Input
                      id="course_code"
                      value={formData.course_code}
                      onChange={(e) => handleInputChange('course_code', e.target.value)}
                      placeholder="例如：CS101"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">課程描述 *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="詳細描述課程內容、學習目標等"
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Course Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>課程設定</CardTitle>
                  <CardDescription>設定課程的分類、難度和其他參數</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Removed category selection as it's not in the backend schema */}
                    <div>
                      <Label htmlFor="difficulty_level">難度等級 *</Label>
                      <Select value={formData.difficulty_level} onValueChange={(value) => handleInputChange('difficulty_level', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇難度等級" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map(difficulty => (
                            <SelectItem key={difficulty.value} value={difficulty.value}>
                              {difficulty.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="max_students">最大學生數</Label>
                    <Input
                      id="max_students"
                      type="number"
                      value={formData.max_students}
                      onChange={(e) => handleInputChange('max_students', e.target.value)}
                      placeholder="50"
                      min="1"
                      max="1000"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">開始日期</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="end_date">結束日期</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>發布設定</CardTitle>
                  <CardDescription>控制課程的可見性</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={(e) => handleInputChange('is_published', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="is_published">立即發布課程</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.is_published 
                        ? '課程將立即對學生可見' 
                        : '課程將保存為草稿，稍後可以發布'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? '創建中...' : '創建課程'}
                  </Button>
                  
                  <Button type="button" variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    預覽
                  </Button>
                </CardContent>
              </Card>

              {/* Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}


