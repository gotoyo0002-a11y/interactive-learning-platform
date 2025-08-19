import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Search, Loader2, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student'
  });
  const [createUserError, setCreateUserError] = useState(null);
  const [createUserSuccess, setCreateUserSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          role,
          created_at,
          auth_users:auth_users_id_fkey(email)
        `);

      if (error) throw error;
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`確定要將此用戶的角色更改為 ${newRole} 嗎？`)) {
      return;
    }
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      alert('用戶角色更新成功！');
    } catch (err) {
      console.error('Error updating user role:', err);
      alert(`更新用戶角色失敗: ${err.message}`);
    }
  };

  const handleNewUserInputChange = (field, value) => {
    setNewUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateUser = async () => {
    setCreateUserError(null);
    setCreateUserSuccess(null);
    try {
      const response = await fetch('https://5000-i7cgs97o0tt2iqq1moivr-8023fc20.manusvm.computer/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserData.email,
          password: newUserData.password,
          user_data: {
            first_name: newUserData.first_name,
            last_name: newUserData.last_name,
            role: newUserData.role
          }
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCreateUserSuccess('用戶創建成功！');
        setIsCreateUserModalOpen(false);
        fetchUsers(); // Refresh user list
        setNewUserData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          role: 'student'
        });
      } else {
        setCreateUserError(result.error || '創建用戶失敗');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setCreateUserError(err.message || '創建用戶時發生錯誤');
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = user.auth_users?.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1 className="text-3xl font-bold mb-6">使用者管理</h1>
        <p>載入使用者資料時發生錯誤: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">使用者管理</h1>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>所有使用者</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜尋使用者 (姓名或Email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setIsCreateUserModalOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              新增使用者
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground">沒有找到符合條件的使用者。</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>註冊時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.auth_users?.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                        disabled={user.role === 'admin'} // 管理員角色不能被修改
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="選擇角色" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">學生</SelectItem>
                          <SelectItem value="teacher">老師</SelectItem>
                          {/* <SelectItem value="admin">管理員</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {/* 未來可添加編輯/刪除按鈕 */}
                      <Button variant="outline" size="sm" disabled>編輯</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新增使用者</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {createUserError && (
              <Alert variant="destructive">
                <AlertDescription>{createUserError}</AlertDescription>
              </Alert>
            )}
            {createUserSuccess && (
              <Alert>
                <AlertDescription>{createUserSuccess}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => handleNewUserInputChange('email', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">密碼</Label>
              <Input
                id="password"
                type="password"
                value={newUserData.password}
                onChange={(e) => handleNewUserInputChange('password', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">名</Label>
              <Input
                id="first_name"
                value={newUserData.first_name}
                onChange={(e) => handleNewUserInputChange('first_name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">姓</Label>
              <Input
                id="last_name"
                value={newUserData.last_name}
                onChange={(e) => handleNewUserInputChange('last_name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">角色</Label>
              <Select value={newUserData.role} onValueChange={(value) => handleNewUserInputChange('role', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="選擇角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">學生</SelectItem>
                  <SelectItem value="teacher">老師</SelectItem>
                  <SelectItem value="admin">管理員</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateUser}>創建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;


