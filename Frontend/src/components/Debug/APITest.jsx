import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { profileAPI, storiesAPI } from '../../services/api'

const APITest = () => {
  const { user, isAuthenticated } = useAuth()
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)

  const testAPI = async (name, apiCall) => {
    try {
      setLoading(true)
      const result = await apiCall()
      setTestResults(prev => ({
        ...prev,
        [name]: { success: true, data: result }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [name]: { success: false, error: error.message, details: error.response?.data }
      }))
    } finally {
      setLoading(false)
    }
  }

  const runTests = async () => {
    if (!isAuthenticated || !user) {
      alert('Please login first')
      return
    }

    setTestResults({})
    
    // Test current user profile
    await testAPI('currentProfile', () => profileAPI.getProfile(user.username))
    
    // Test user stories
    await testAPI('userStories', () => storiesAPI.getUserStories(user.username))
    
    // Test stories list
    await testAPI('storiesList', () => storiesAPI.getStories())
    
    // Test current user endpoint
    await testAPI('currentUser', () => profileAPI.updateProfile({}))
  }

  return (
    <div className="fixed bottom-20 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md max-h-96 overflow-y-auto">
      <div className="font-semibold mb-3">API Test Panel</div>
      
      <button 
        onClick={runTests}
        disabled={loading || !isAuthenticated}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm mb-3 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run API Tests'}
      </button>

      <div className="space-y-2 text-xs">
        {Object.entries(testResults).map(([name, result]) => (
          <div key={name} className="border-l-2 pl-2 border-gray-600">
            <div className={`font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {name}: {result.success ? '✅ Success' : '❌ Failed'}
            </div>
            {result.success ? (
              <div className="text-gray-300 truncate">
                Data: {typeof result.data === 'object' ? JSON.stringify(result.data).substring(0, 50) + '...' : result.data}
              </div>
            ) : (
              <div className="text-red-300">
                <div>Error: {result.error}</div>
                {result.details && (
                  <div>Details: {JSON.stringify(result.details).substring(0, 100)}...</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isAuthenticated && (
        <div className="text-yellow-400 text-xs mt-2">
          ⚠️ Please login to test APIs
        </div>
      )}
    </div>
  )
}

export default APITest
