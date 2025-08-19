import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { CoursesPage } from './pages/CoursesPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { CourseCreatePage } from './pages/admin/CourseCreatePage'
import UserManagementPage from './pages/admin/UserManagementPage'
import AdminCourseManagementPage from './pages/admin/CourseManagementPage'
import { ActivityLogs } from './pages/admin/ActivityLogs'
import CourseManagementPage from './pages/teacher/CourseManagementPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './stores/authStore'
import './App.css'

function App() {
  const { initialize, loading } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="courses" element={<CoursesPage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/courses/create" element={<CourseCreatePage />} />
            <Route path="admin/user-management" element={<UserManagementPage />} />
            <Route path="admin/course-management" element={<AdminCourseManagementPage />} />
            <Route path="admin/activities" element={<ActivityLogs />} />
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
            <Route path="teacher/course-management" element={<CourseManagementPage />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
