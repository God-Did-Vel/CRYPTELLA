import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

// Customer-only pages (buying, orders). Admins are sent to the admin area.
export default function CustomerRoute({ children }) {
  const { user } = useAuth()
  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? <Navigate to="/admin" replace /> : children}
    </ProtectedRoute>
  )
}
