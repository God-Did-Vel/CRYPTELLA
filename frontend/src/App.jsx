import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import CustomerRoute from './components/CustomerRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Markets from './pages/Markets'
import Trade from './pages/Trade'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import AdminOverview from './pages/AdminOverview'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import NotFound from './pages/NotFound'

// Pages that don't need the footer
const NO_FOOTER = ['/login', '/register']

// Admins land in the admin area instead of the marketing page
const HomeRoute = () => {
  const { user } = useAuth()
  return user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Home />
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"           element={<HomeRoute />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/markets"    element={<Markets />} />
        <Route path="/trade/:coinId" element={<Trade />} />
        <Route path="/dashboard"  element={<CustomerRoute><Dashboard /></CustomerRoute>} />
        <Route path="/orders"     element={<CustomerRoute><Orders /></CustomerRoute>} />
        <Route path="/orders/:id" element={<CustomerRoute><OrderDetails /></CustomerRoute>} />
        <Route path="/admin"        element={<AdminRoute><AdminOverview /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users"  element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
