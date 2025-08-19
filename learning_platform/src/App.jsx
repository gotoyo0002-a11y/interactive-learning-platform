import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { CoursesPage } from './pages/CoursesPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { CourseCreatePage } from './pages/admin/CourseCreatePage'
import { UserManagement } from './pages/admin/UserManagement'
import { ActivityLogs } from './pages/admin/ActivityLogs'
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
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/courses/create" element={<CourseCreatePage />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/activities" element={<ActivityLogs />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
