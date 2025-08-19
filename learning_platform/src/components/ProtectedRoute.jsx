import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, profile, loading } = useAuthStore();

  if (loading) {
    return <div>載入中...</div>; // 或者一個加載指示器
  }

  if (!user) {
    // 如果用戶未登錄，重定向到登錄頁面
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    // 如果用戶角色不符合要求，重定向到首頁或顯示未授權訊息
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


