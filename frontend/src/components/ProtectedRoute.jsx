import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9ff]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
