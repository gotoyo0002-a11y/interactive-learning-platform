import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { supabase } from '../../lib/supabase'
import { 
  Activity, 
  Search, 
  Filter,
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react'
import '../../App.css'

export function ActivityLogs() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setActivities(data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      setError('獲取活動日誌失敗')
    } finally {
      setLoading(false)
    }
  }

  const getActionLabel = (action) => {
    const actionLabels = {
      'RESET_PASSWORD': '重置密碼',
      'DELETE_USER': '刪除用戶',
      'CREATE_USER': '創建用戶',
      'UPDATE_USER': '更新用戶',
      'CREATE_COURSE': '創建課程',
      'UPDATE_COURSE': '更新課程',
      'DELETE_COURSE': '刪除課程',
      'PUBLISH_COURSE': '發布課程',
      'UNPUBLISH_COURSE': '取消發布課程',
      'CREATE_ASSIGNMENT': '創建作業',
      'UPDATE_ASSIGNMENT': '更新作業',
      'DELETE_ASSIGNMENT': '刪除作業',
      'GRADE_ASSIGNMENT': '評分作業',
      'CREATE_ANNOUNCEMENT': '創建公告',
      'UPDATE_ANNOUNCEMENT': '更新公告',
      'DELETE_ANNOUNCEMENT': '刪除公告'
    }
    return actionLabels[action] || action
  }

  const getActionBadge = (action) => {
    const actionTypes = {
      'CREATE_': 'default',
      'UPDATE_': 'secondary',
      'DELETE_': 'destructive',
      'RESET_': 'outline',
      'PUBLISH_': 'default',
      'UNPUBLISH_': 'outline',
      'GRADE_': 'secondary'
    }

    const variant = Object.entries(actionTypes).find(([prefix]) => 
      action.startsWith(prefix)
    )?.[1] || 'outline'

    return <Badge variant={variant}>{getActionLabel(action)}</Badge>
  }

  const getTargetTypeIcon = (targetType) => {
    const icons = {
      'user': User,
      'course': FileText,
      'assignment': FileText,
      'announcement': AlertCircle
    }
    
    const Icon = icons[targetType] || FileText
    return <Icon className="h-4 w-4" />
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === 'all' || activity.action === actionFilter

    return matchesSearch && matchesAction
  })

  const uniqueActions = [...new Set(activities.map(activity => activity.action))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">活動日誌</h1>
          <p className="text-gray-600">查看系統中的所有管理員操作記錄</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索活動..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇操作類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有操作</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>
                        {getActionLabel(action)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              活動記錄
            </CardTitle>
            <CardDescription>
              共 {filteredActivities.length} 條記錄
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">載入失敗</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到活動記錄</h3>
                <p className="text-gray-600">請嘗試調整搜索條件</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      {getTargetTypeIcon(activity.target_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {getActionBadge(activity.action)}
                        <Badge variant="outline" className="text-xs">
                          {activity.target_type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-900 mb-1">
                        <span className="font-medium">目標 ID：</span>
                        <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {activity.target_id}
                        </span>
                      </div>
                      {activity.target_details && (
                        <div className="text-sm text-gray-600 mb-2">
                          {activity.target_details.target_user && (
                            <div>
                              用戶：{activity.target_details.target_user.first_name} {activity.target_details.target_user.last_name} 
                              ({activity.target_details.target_user.email})
                            </div>
                          )}
                          {activity.target_details.deleted_user && (
                            <div>
                              已刪除用戶：{activity.target_details.deleted_user.first_name} {activity.target_details.deleted_user.last_name} 
                              ({activity.target_details.deleted_user.email})
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(activity.created_at).toLocaleString('zh-TW')}
                        </div>
                        <div className="flex items-center">
                          <span>IP：{activity.ip_address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

