import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  Heart, 
  Share2,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Calendar,
  Star
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { storiesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: userStories, isLoading: storiesLoading, error: storiesError } = useQuery(
    ['user-stories', user?.username],
    () => storiesAPI.getUserStories(user?.username),
    { 
      enabled: !!user?.username,
      retry: 1,
      onError: (error) => {
        console.error('User stories fetch error:', error)
      }
    }
  )

  // Calculate stats
  const totalLikes = userStories?.reduce((sum, story) => sum + (story.likes_count || 0), 0) || 0
  const totalShares = userStories?.reduce((sum, story) => sum + (story.shares_count || 0), 0) || 0
  const totalChapters = userStories?.reduce((sum, story) => sum + (story.chapters?.length || 0), 0) || 0

  const stats = [
    {
      label: 'Stories Published',
      value: userStories?.length || 0,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Total Likes',
      value: totalLikes,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    {
      label: 'Total Shares',
      value: totalShares,
      icon: Share2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Chapters Written',
      value: totalChapters,
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'stories', label: 'My Stories', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please login to access your dashboard.</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-gray-400">
              Manage your stories and track your writing progress
            </p>
          </div>
          <Link to="/stories/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create New Story</span>
            </motion.button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/stories/create">
                    <div className="p-4 bg-primary-600/10 border border-primary-600/20 rounded-lg hover:bg-primary-600/20 transition-colors">
                      <PlusCircle className="h-8 w-8 text-primary-400 mb-2" />
                      <h3 className="font-medium text-white mb-1">Create Story</h3>
                      <p className="text-sm text-gray-400">Start writing a new interactive story</p>
                    </div>
                  </Link>
                  <Link to={`/profile/${user?.username}`}>
                    <div className="p-4 bg-secondary-600/10 border border-secondary-600/20 rounded-lg hover:bg-secondary-600/20 transition-colors">
                      <Users className="h-8 w-8 text-secondary-400 mb-2" />
                      <h3 className="font-medium text-white mb-1">View Profile</h3>
                      <p className="text-sm text-gray-400">See how others view your profile</p>
                    </div>
                  </Link>
                  <Link to="/stories">
                    <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg hover:bg-green-600/20 transition-colors">
                      <BookOpen className="h-8 w-8 text-green-400 mb-2" />
                      <h3 className="font-medium text-white mb-1">Browse Stories</h3>
                      <p className="text-sm text-gray-400">Discover new interactive stories</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Stories */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Stories</h2>
                  <Link to="#" onClick={() => setActiveTab('stories')} className="text-primary-400 hover:text-primary-300 text-sm">
                    View All
                  </Link>
                </div>
                {storiesLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : userStories?.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">You haven't created any stories yet</p>
                    <Link to="/stories/create" className="btn-primary">
                      Create Your First Story
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userStories?.slice(0, 3).map((story) => (
                      <div key={story.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">{story.title}</h3>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-1">{story.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{story.likes_count || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Share2 className="h-3 w-3" />
                              <span>{story.shares_count || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Link to={`/stories/${story.slug}`}>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <Link to={`/stories/${story.slug}/edit`}>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div>
              {storiesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : userStories?.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Stories Yet</h3>
                  <p className="text-gray-400 mb-6">You haven't created any stories yet. Start writing your first story!</p>
                  <Link to="/stories/create" className="btn-primary">
                    Create Your First Story
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userStories?.map((story) => (
                    <div key={story.id} className="card">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Story Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{story.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                story.is_published 
                                  ? 'bg-green-600/20 text-green-400' 
                                  : 'bg-yellow-600/20 text-yellow-400'
                              }`}>
                                {story.is_published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-400 mb-3 line-clamp-2">{story.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{story.likes_count || 0} likes</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Share2 className="h-4 w-4" />
                              <span>{story.shares_count || 0} shares</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{story.chapters?.length || 0} chapters</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Updated {formatDistanceToNow(new Date(story.updated_at), { addSuffix: true })}</span>
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Link to={`/stories/${story.slug}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn-outline flex items-center space-x-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </motion.button>
                          </Link>
                          <Link to={`/stories/${story.slug}/edit`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn-secondary flex items-center space-x-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Performance Overview */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6">Performance Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-400 mb-2">{totalLikes}</div>
                    <div className="text-gray-400">Total Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-400 mb-2">{totalShares}</div>
                    <div className="text-gray-400">Total Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{userStories?.length || 0}</div>
                    <div className="text-gray-400">Stories Published</div>
                  </div>
                </div>
              </div>

              {/* Top Performing Stories */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Top Performing Stories</h2>
                {userStories?.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No stories to analyze yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userStories
                      ?.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
                      .slice(0, 5)
                      .map((story, index) => (
                        <div key={story.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold text-gray-500">#{index + 1}</div>
                            <div>
                              <h3 className="font-medium text-white">{story.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>{story.likes_count || 0} likes</span>
                                <span>{story.shares_count || 0} shares</span>
                              </div>
                            </div>
                          </div>
                          <Link to={`/stories/${story.slug}`} className="btn-outline btn-sm">
                            View
                          </Link>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
