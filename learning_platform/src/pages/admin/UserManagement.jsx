import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { supabase } from '../../lib/supabase'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  UserPlus,
  Mail,
  Calendar
} from 'lucide-react'
import '../../App.css'

export function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          users!user_profiles_user_id_fkey (
            id,
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('獲取用戶列表失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      // 使用 Supabase Auth Admin API 創建用戶
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          role: newUser.role
        }
      })

      if (authError) throw authError

      // 創建用戶檔案
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role
        })

      if (profileError) throw profileError

      setSuccess('用戶創建成功！')
      setShowCreateDialog(false)
      setNewUser({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student'
      })
      fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      setError('創建用戶失敗：' + error.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('確定要刪除此用戶嗎？此操作無法撤銷。')) {
      return
    }

    try {
      // 刪除用戶檔案
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId)

      if (profileError) throw profileError

      // 使用 Admin API 刪除認證用戶
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)

      if (authError) throw authError

      setSuccess('用戶刪除成功！')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('刪除用戶失敗：' + error.message)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: '管理員', variant: 'destructive' },
      teacher: { label: '教師', variant: 'default' },
      student: { label: '學生', variant: 'secondary' }
    }
    
    const config = roleConfig[role] || { label: role, variant: 'outline' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">用戶管理</h1>
              <p className="text-gray-600">管理系統中的所有用戶</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新增用戶
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>創建新用戶</DialogTitle>
                  <DialogDescription>
                    填寫以下資訊來創建一個新的用戶帳號
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">名字</Label>
                      <Input
                        id="first_name"
                        value={newUser.first_name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">姓氏</Label>
                      <Input
                        id="last_name"
                        value={newUser.last_name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">電子郵件</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">密碼</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">角色</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">學生</SelectItem>
                        <SelectItem value="teacher">教師</SelectItem>
                        <SelectItem value="admin">管理員</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      取消
                    </Button>
                    <Button type="submit">
                      創建用戶
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索用戶..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有角色</SelectItem>
                    <SelectItem value="student">學生</SelectItem>
                    <SelectItem value="teacher">教師</SelectItem>
                    <SelectItem value="admin">管理員</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              用戶列表
            </CardTitle>
            <CardDescription>
              共 {filteredUsers.length} 個用戶
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到用戶</h3>
                <p className="text-gray-600">請嘗試調整搜索條件</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.users?.email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(user.users?.created_at).toLocaleDateString('zh-TW')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getRoleBadge(user.role)}
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteUser(user.user_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
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

