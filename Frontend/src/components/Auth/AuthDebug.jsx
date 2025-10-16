import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const AuthDebug = () => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-600 text-white p-3 rounded-lg shadow-lg text-sm">
        🔄 Loading auth state...
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm max-w-xs">
      <div className="font-semibold mb-2">Auth Debug:</div>
      <div>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
      <div>User: {user ? user.username : 'None'}</div>
      <div>Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</div>
      {user && (
        <div className="mt-2 text-xs">
          <div>ID: {user.id}</div>
          <div>Email: {user.email}</div>
        </div>
      )}
    </div>
  )
}

export default AuthDebug
