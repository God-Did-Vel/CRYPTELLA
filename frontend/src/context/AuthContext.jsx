import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cryptella_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('cryptella_token', data.token)
      localStorage.setItem('cryptella_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (firstName, lastName, email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { firstName, lastName, email, password })
      localStorage.setItem('cryptella_token', data.token)
      localStorage.setItem('cryptella_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const errors = err.response?.data?.errors
      const message = errors ? errors[0].msg : (err.response?.data?.message || 'Registration failed')
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('cryptella_token')
    localStorage.removeItem('cryptella_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
