import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  BookOpen, 
  Image, 
  Save, 
  ArrowLeft,
  Upload,
  X,
  Eye
} from 'lucide-react'
import { storiesAPI } from '../services/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const StoryEdit = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { data: story, isLoading: storyLoading } = useQuery(
    ['story', slug],
    () => storiesAPI.getStory(slug),
    { enabled: !!slug }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm()

  // Reset form when story data loads
  useEffect(() => {
    if (story) {
      reset({
        title: story.title,
        description: story.description,
        content: story.content,
        category: story.category
      })
      if (story.cover_image) {
        setCoverPreview(story.cover_image)
      }
    }
  }, [story, reset])

  const updateMutation = useMutation(
    (data) => storiesAPI.updateStory(slug, data),
    {
      onSuccess: (updatedStory) => {
        queryClient.invalidateQueries(['story', slug])
        toast.success('Story updated successfully!')
        navigate(`/stories/${updatedStory.slug}`)
      },
      onError: (error) => {
        const errorData = error.response?.data
        if (errorData) {
          Object.keys(errorData).forEach(field => {
            if (errorData[field] && Array.isArray(errorData[field])) {
              setError(field, { message: errorData[field][0] })
            }
          })
        } else {
          toast.error('Failed to update story')
        }
      }
    }
  )

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setCoverImage(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    setCoverPreview(story?.cover_image || null)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('content', data.content)
      formData.append('category', data.category)
      
      if (coverImage) {
        formData.append('cover_image', coverImage)
      }

      await updateMutation.mutateAsync(formData)
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    'Fantasy',
    'Sci-Fi',
    'Mystery',
    'Romance',
    'Adventure',
    'Horror',
    'Drama',
    'Comedy',
    'Thriller',
    'Historical'
  ]

  if (storyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Story Not Found</h1>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!story.can_edit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to edit this story.</p>
          <button onClick={() => navigate(`/stories/${slug}`)} className="btn-primary">
            View Story
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/stories/${slug}`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Story</h1>
              <p className="text-gray-400">Update your story details</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/stories/${slug}`)}
              className="btn-outline flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <BookOpen className="h-12 w-12 text-primary-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Story Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      {...register('title', {
                        required: 'Title is required',
                        minLength: {
                          value: 3,
                          message: 'Title must be at least 3 characters'
                        },
                        maxLength: {
                          value: 200,
                          message: 'Title must be less than 200 characters'
                        }
                      })}
                      type="text"
                      className="input"
                      placeholder="Enter your story title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description', {
                        required: 'Description is required',
                        minLength: {
                          value: 10,
                          message: 'Description must be at least 10 characters'
                        }
                      })}
                      rows={4}
                      className="input resize-none"
                      placeholder="Describe your story to attract readers..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      {...register('category')}
                      className="input"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category.toLowerCase()}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Story Content</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    {...register('content', {
                      required: 'Story content is required',
                      minLength: {
                        value: 50,
                        message: 'Content must be at least 50 characters'
                      }
                    })}
                    rows={12}
                    className="input resize-none font-serif"
                    placeholder="Your story content..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Cover Image</h2>
                
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {coverImage && (
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <div className="mt-4">
                      <label className="btn-outline cursor-pointer inline-flex items-center space-x-2 w-full justify-center">
                        <Upload className="h-4 w-4" />
                        <span>Change Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Image className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Upload a cover image</p>
                    <label className="btn-outline cursor-pointer inline-flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Max size: 5MB. Recommended: 800x600px
                    </p>
                  </div>
                )}
              </div>

              {/* Story Stats */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Story Stats</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Likes</span>
                    <span className="text-primary-400">{story.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Shares</span>
                    <span className="text-secondary-400">{story.shares_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Chapters</span>
                    <span className="text-green-400">{story.chapters?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  type="submit"
                  disabled={isLoading || updateMutation.isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || updateMutation.isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating Story...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Update Story</span>
                    </div>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => navigate(`/stories/${slug}`)}
                  className="w-full btn-outline py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StoryEdit
