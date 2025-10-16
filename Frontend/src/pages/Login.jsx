import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, BookOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await login(data)
      // Redirect to dashboard after successful login
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid credentials'
      setError('root', { message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-gray-900 to-secondary-900/20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full space-y-8"
      >
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2">
              Sign in to continue your storytelling journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username/Email */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username', {
                    required: 'Username or email is required'
                  })}
                  type="text"
                  className="input pl-10"
                  placeholder="Enter your username or email"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-400">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Forgot Password */}
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-outline py-3"
                >
                  Create Account
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
