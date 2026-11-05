import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

// Hides admin pages from non-admins (the API enforces this independently)
export default function AdminRoute({ children }) {
  const { user } = useAuth()
  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />}
    </ProtectedRoute>
  )
}
