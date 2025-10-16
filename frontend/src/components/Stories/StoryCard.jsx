import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Share2, 
  User, 
  Calendar, 
  BookOpen,
  Eye
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const StoryCard = ({ story, viewMode = 'grid' }) => {
  const {
    id,
    title,
    slug,
    description,
    author_username,
    created_at,
    likes_count,
    shares_count,
    is_liked,
    cover_image,
    chapters
  } = story

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="card group cursor-pointer"
      >
        <Link to={`/stories/${slug}`}>
          <div className="flex items-center gap-6">
            {/* Cover Image */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary-900/20 to-secondary-900/20 rounded-lg overflow-hidden flex-shrink-0">
              {cover_image ? (
                <img
                  src={cover_image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray-600" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1 mb-2">
                {title}
              </h3>
              
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                {description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <Link 
                      to={`/profile/${author_username}`}
                      className="hover:text-primary-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {author_username}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Heart className={`h-4 w-4 ${is_liked ? 'text-red-400 fill-current' : ''}`} />
                    <span>{likes_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="h-4 w-4" />
                    <span>{shares_count || 0}</span>
                  </div>
                  {chapters?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{chapters.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card group cursor-pointer overflow-hidden"
    >
      <Link to={`/stories/${slug}`}>
        {/* Cover Image */}
        <div className="relative h-48 mb-4 bg-gradient-to-br from-primary-900/20 to-secondary-900/20 rounded-lg overflow-hidden">
          {cover_image ? (
            <img
              src={cover_image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
          
          {/* Stats Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-3 text-white text-sm">
            <div className="flex items-center space-x-1">
              <Heart className={`h-4 w-4 ${is_liked ? 'text-red-400 fill-current' : ''}`} />
              <span>{likes_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
              <span>{shares_count || 0}</span>
            </div>
            {chapters?.length > 0 && (
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{chapters.length} chapters</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm line-clamp-3">
            {description}
          </p>

          {/* Author and Date */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <Link 
                to={`/profile/${author_username}`}
                className="hover:text-primary-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {author_username}
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default StoryCard
