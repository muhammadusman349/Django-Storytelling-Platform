import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  TrendingUp, 
  Clock, 
  Heart,
  ChevronDown
} from 'lucide-react'
import { storiesAPI } from '../services/api'
import StoryCard from '../components/Stories/StoryCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Stories = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('-created_at')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const { data: stories, isLoading, error } = useQuery(
    ['stories', { search: searchQuery, category: selectedCategory, ordering: sortBy }],
    () => storiesAPI.getStories({
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      ordering: sortBy
    }),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000
    }
  )

  const categories = [
    'Fantasy',
    'Sci-Fi',
    'Mystery',
    'Romance',
    'Adventure',
    'Horror',
    'Drama',
    'Comedy'
  ]

  const sortOptions = [
    { value: '-created_at', label: 'Newest First', icon: Clock },
    { value: 'created_at', label: 'Oldest First', icon: Clock },
    { value: '-likes_count', label: 'Most Liked', icon: Heart },
    { value: 'title', label: 'A-Z', icon: TrendingUp },
    { value: '-title', label: 'Z-A', icon: TrendingUp }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by the query dependency
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover <span className="gradient-text">Stories</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore interactive stories created by our community of talented writers
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 w-full"
                  />
                </div>
              </form>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category.toLowerCase()}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          {stories && (
            <p className="text-gray-400">
              Found {Array.isArray(stories) ? stories.length : (stories.count || stories.results?.length || 0)} {Array.isArray(stories) ? stories.length === 1 ? 'story' : 'stories' : (stories.count === 1 ? 'story' : 'stories')}
            </p>
          )}
        </div>

        {/* Stories Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load stories</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : (Array.isArray(stories) ? stories.length === 0 : (stories?.results?.length === 0)) ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No stories found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {(Array.isArray(stories) ? stories : stories?.results)?.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <StoryCard story={story} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More / Pagination */}
        {!Array.isArray(stories) && stories?.next && (
          <div className="text-center mt-12">
            <button className="btn-primary">
              Load More Stories
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stories
