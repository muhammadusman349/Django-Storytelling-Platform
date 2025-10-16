import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { 
  BookOpen, 
  Image, 
  Save, 
  ArrowLeft,
  Upload,
  X
} from 'lucide-react'
import { storiesAPI } from '../services/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const StoryCreate = () => {
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm()

  const createMutation = useMutation(
    (data) => storiesAPI.createStory(data),
    {
      onSuccess: (story) => {
        toast.success('Story created successfully!')
        navigate(`/stories/${story.slug}`)
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
          toast.error('Failed to create story')
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
    setCoverPreview(null)
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

      await createMutation.mutateAsync(formData)
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Story</h1>
              <p className="text-gray-400">Share your creative vision with the world</p>
            </div>
          </div>
          <BookOpen className="h-12 w-12 text-primary-400" />
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
                    Initial Content *
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
                    placeholder="Begin your story here... You can add chapters later."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-400">
                    This will be the opening of your story. You can add more chapters after creation.
                  </p>
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
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
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

              {/* Publishing Options */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Publishing</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status</span>
                    <span className="text-green-400">Published</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Visibility</span>
                    <span className="text-blue-400">Public</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  type="submit"
                  disabled={isLoading || createMutation.isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || createMutation.isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Story...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create Story</span>
                    </div>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
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

export default StoryCreate
