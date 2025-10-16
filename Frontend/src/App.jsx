import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Stories from './pages/Stories'
import StoryDetail from './pages/StoryDetail'
import StoryCreate from './pages/StoryCreate'
import StoryEdit from './pages/StoryEdit'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/profile/:username" element={<Profile />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/stories/create" element={
            <ProtectedRoute>
              <StoryCreate />
            </ProtectedRoute>
          } />
          <Route path="/stories/:slug/edit" element={
            <ProtectedRoute>
              <StoryEdit />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
