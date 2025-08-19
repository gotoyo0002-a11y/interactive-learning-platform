import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const AdminCourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // 管理員可以讀取所有課程，不受 RLS 限制
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          user_profiles!courses_teacher_id_fkey(first_name, last_name)
        `);

      if (error) throw error;
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const courseTitle = course.title?.toLowerCase() || '';
    const teacherName = `${course.user_profiles?.first_name || ''} ${course.user_profiles?.last_name || ''}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return courseTitle.includes(search) || teacherName.includes(search);
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
        <h1 className="text-3xl font-bold mb-6">課程管理</h1>
        <p>載入課程資料時發生錯誤: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">課程管理</h1>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>所有課程</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜尋課程 (標題或老師姓名)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <p className="text-center text-muted-foreground">沒有找到符合條件的課程。</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>課程標題</TableHead>
                  <TableHead>老師</TableHead>
                  <TableHead>分類</TableHead>
                  <TableHead>難度</TableHead>
                  <TableHead>發布狀態</TableHead>
                  <TableHead>創建日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.user_profiles?.first_name} {course.user_profiles?.last_name}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.difficulty}</TableCell>
                    <TableCell>
                      <Badge variant={course.is_published ? "default" : "outline"}>
                        {course.is_published ? "已發布" : "草稿"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(course.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">編輯</Button>
                      <Button variant="outline" size="sm" className="mr-2">
                        {course.is_published ? "下架" : "發布"}
                      </Button>
                      <Button variant="destructive" size="sm">刪除</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourseManagementPage;


