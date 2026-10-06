import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import IntroOverlay from './components/IntroOverlay'
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

// New Luxury Crypto Pages
import HelpCenter from './pages/HelpCenter'
import ContactUs from './pages/ContactUs'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AboutUs from './pages/AboutUs'
import HowItWorks from './pages/HowItWorks'
import WhyUs from './pages/WhyUs'
import ScrollToTop from './components/ScrollToTop'

// Pages that don't need the footer
const NO_FOOTER = ['/login', '/register']

// Admins land in the admin area instead of the marketing page
const HomeRoute = () => {
  const { user } = useAuth()
  return user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Home />
}

function MainLayout() {
  const location = useLocation()
  // Show intro every single time the screen/page is refreshed or loaded
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    if (location.search.includes('intro=1')) {
      setShowIntro(true)
    }
  }, [location.search])

  const handleCloseIntro = () => {
    setShowIntro(false)
  }

  const hideFooter = NO_FOOTER.includes(location.pathname)

  return (
    <>
      {/* Intro / Splash Screen Overlay (Shows every time screen is refreshed) */}
      <IntroOverlay isOpen={showIntro} onClose={handleCloseIntro} />

      <Navbar />

      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/trade/:coinId" element={<Trade />} />
        <Route path="/dashboard" element={<CustomerRoute><Dashboard /></CustomerRoute>} />
        <Route path="/orders" element={<CustomerRoute><Orders /></CustomerRoute>} />
        <Route path="/orders/:id" element={<CustomerRoute><OrderDetails /></CustomerRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

        {/* Dedicated Luxury Crypto Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Floating Scroll To Top Arrow Button */}
      <ScrollToTop />

      {!hideFooter && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}
