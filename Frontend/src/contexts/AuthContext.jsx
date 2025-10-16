import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          // Try to parse stored user first
          const userData = JSON.parse(storedUser)
          setUser(userData)
          
          // Optionally verify with server
          try {
            const currentUserData = await authAPI.getCurrentUser()
            setUser(currentUserData)
            localStorage.setItem('user', JSON.stringify(currentUserData))
          } catch (error) {
            // If server verification fails, keep stored user data
            console.log('Server verification failed, using stored user data')
          }
        } catch (error) {
          // If stored data is invalid, clear everything
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { user: userData, tokens } = response
      
      localStorage.setItem('token', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      toast.success('Welcome back!')
      return userData
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { user: newUser, tokens } = response
      
      localStorage.setItem('token', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      
      toast.success('Account created successfully!')
      return newUser
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
