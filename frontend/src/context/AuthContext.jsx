import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout()
        } else {
          setUser({ id: decoded.user_id, username: decoded.username })
        }
      } catch (error) {
        console.error('Token decode error:', error)
        logout()
      }
    }
    setLoading(false)
  }, [token])

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password })
      const { token, user } = response
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password })
      const { token, user } = response
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}