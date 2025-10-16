import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Share2, 
  User, 
  Calendar, 
  BookOpen, 
  Edit,
  Trash2,
  ArrowLeft,
  Play,
  Users,
  MessageCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { storiesAPI, chaptersAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const StoryDetail = () => {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showShareMenu, setShowShareMenu] = useState(false)

  const { data: story, isLoading, error } = useQuery(
    ['story', slug],
    () => storiesAPI.getStory(slug),
    { enabled: !!slug }
  )

  const { data: chapters } = useQuery(
    ['chapters', slug],
    () => chaptersAPI.getChapters(slug),
    { enabled: !!slug }
  )

  const likeMutation = useMutation(
    () => storiesAPI.likeStory(slug),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['story', slug])
        toast.success(story?.is_liked ? 'Story unliked' : 'Story liked!')
      },
      onError: () => {
        toast.error('Failed to update like status')
      }
    }
  )

  const shareMutation = useMutation(
    (platform) => storiesAPI.shareStory(slug, platform),
    {
      onSuccess: (data) => {
        toast.success(data.message)
        setShowShareMenu(false)
      },
      onError: () => {
        toast.error('Failed to share story')
      }
    }
  )

  const deleteMutation = useMutation(
    () => storiesAPI.deleteStory(slug),
    {
      onSuccess: () => {
        toast.success('Story deleted successfully')
        navigate('/stories')
      },
      onError: () => {
        toast.error('Failed to delete story')
      }
    }
  )

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like stories')
      return
    }
    likeMutation.mutate()
  }

  const handleShare = (platform) => {
    if (!user) {
      toast.error('Please login to share stories')
      return
    }
    shareMutation.mutate(platform)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Story Not Found</h1>
          <p className="text-gray-400 mb-6">The story you're looking for doesn't exist.</p>
          <Link to="/stories" className="btn-primary">
            Browse Stories
          </Link>
        </div>
      </div>
    )
  }

  const shareOptions = [
    { platform: 'twitter', label: 'Twitter', color: 'bg-blue-500' },
    { platform: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
    { platform: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
    { platform: 'email', label: 'Email', color: 'bg-gray-600' }
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link 
          to="/stories" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stories
        </Link>

        {/* Story Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          {/* Cover Image */}
          {story.cover_image && (
            <div className="relative h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
              <img
                src={story.cover_image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
            </div>
          )}

          {/* Title and Meta */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {story.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <Link 
                    to={`/profile/${story.author_username}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {story.author_username}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{chapters?.length || 0} chapters</span>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                {story.description}
              </p>
            </div>

            {/* Author Actions */}
            {story.can_edit && (
              <div className="flex items-center space-x-2">
                <Link to={`/stories/${slug}/edit`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="btn bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                disabled={likeMutation.isLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  story.is_liked
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Heart className={`h-4 w-4 ${story.is_liked ? 'fill-current' : ''}`} />
                <span>{story.likes_count || 0}</span>
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{story.shares_count || 0}</span>
                </motion.button>

                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-0 card p-2 min-w-[150px] z-10"
                  >
                    {shareOptions.map(option => (
                      <button
                        key={option.platform}
                        onClick={() => handleShare(option.platform)}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Start Reading */}
            {chapters?.length > 0 && (
              <Link to={`/stories/${slug}/read`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Reading</span>
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Chapters */}
        {chapters?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Chapters</h2>
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Chapter {chapter.order}: {chapter.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {formatDistanceToNow(new Date(chapter.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {chapter.decision_points?.length > 0 && (
                      <div className="flex items-center space-x-1 text-primary-400">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{chapter.decision_points.length} decisions</span>
                      </div>
                    )}
                    <Link
                      to={`/stories/${slug}/chapters/${chapter.id}`}
                      className="btn-outline btn-sm"
                    >
                      Read
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Chapters */}
        {chapters?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Chapters Yet</h2>
            <p className="text-gray-400">
              This story hasn't been published yet. Check back later!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default StoryDetail
