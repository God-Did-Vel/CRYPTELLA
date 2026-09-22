import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Markets from './pages/Markets'
import Trade from './pages/Trade'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'

// Pages that don't need the footer
const NO_FOOTER = ['/login', '/register']

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/markets"    element={<Markets />} />
        <Route path="/trade/:coinId" element={<Trade />} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/portfolio"  element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
