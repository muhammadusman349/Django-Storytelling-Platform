import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          })
          
          const newToken = response.data.access
          localStorage.setItem('token', newToken)
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/token/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getCurrentUser: () => api.get('/profile/'),
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
}

// Profile API
export const profileAPI = {
  getProfile: (username) => api.get(`/profile/${username}/`),
  updateProfile: (data) => api.patch('/profile/update/', data),
  followUser: (username) => api.post(`/follow/${username}/`),
  unfollowUser: (username) => api.post(`/unfollow/${username}/`),
  getFollowers: async (username) => {
    const data = await api.get(`/profile/${username}/followers/`)
    return data?.results || data
  },
  getFollowing: async (username) => {
    const data = await api.get(`/profile/${username}/following/`)
    return data?.results || data
  },
}

// Stories API
export const storiesAPI = {
  getStories: (params) => api.get('/stories/', { params }),
  getStory: (slug) => api.get(`/stories/${slug}/`),
  createStory: (data) => api.post('/stories/', data),
  updateStory: (slug, data) => api.patch(`/stories/${slug}/`, data),
  deleteStory: (slug) => api.delete(`/stories/${slug}/`),
  likeStory: (slug) => api.post(`/stories/${slug}/like/`),
  shareStory: (slug, platform) => api.post(`/stories/${slug}/share/`, { platform }),
  getUserStories: async (username) => {
    const data = await api.get(`/stories/user/${username}/`)
    return data?.results || data
  },
  getStoryStats: (slug) => api.get(`/stories/${slug}/stats/`),
  getStoryShares: async (slug) => {
    const data = await api.get(`/stories/${slug}/shares/`)
    return data?.results || data
  },
}

// Chapters API
export const chaptersAPI = {
  getChapters: async (storySlug) => {
    const data = await api.get(`/stories/${storySlug}/chapters/`)
    return data?.results || data
  },
  getChapter: (storySlug, chapterId) => api.get(`/stories/${storySlug}/chapters/${chapterId}/`),
  createChapter: (storySlug, data) => api.post(`/stories/${storySlug}/chapters/`, data),
  updateChapter: (storySlug, chapterId, data) => api.patch(`/stories/${storySlug}/chapters/${chapterId}/`, data),
  deleteChapter: (storySlug, chapterId) => api.delete(`/stories/${storySlug}/chapters/${chapterId}/`),
}

// Decision Points API
export const decisionPointsAPI = {
  getDecisionPoints: (storySlug, chapterId) => 
    api.get(`/stories/${storySlug}/chapters/${chapterId}/decision-points/`),
  getDecisionPoint: (storySlug, chapterId, decisionId) => 
    api.get(`/stories/${storySlug}/chapters/${chapterId}/decision-points/${decisionId}/`),
  createDecisionPoint: (storySlug, chapterId, data) => 
    api.post(`/stories/${storySlug}/chapters/${chapterId}/decision-points/`, data),
  updateDecisionPoint: (storySlug, chapterId, decisionId, data) => 
    api.patch(`/stories/${storySlug}/chapters/${chapterId}/decision-points/${decisionId}/`, data),
  deleteDecisionPoint: (storySlug, chapterId, decisionId) => 
    api.delete(`/stories/${storySlug}/chapters/${chapterId}/decision-points/${decisionId}/`),
}

// Choices API
export const choicesAPI = {
  getChoices: (storySlug, chapterId, decisionPointId) => 
    api.get(`/stories/${storySlug}/chapters/${chapterId}/decision-points/${decisionPointId}/choices/`),
  createChoice: (storySlug, chapterId, decisionPointId, data) => 
    api.post(`/stories/${storySlug}/chapters/${chapterId}/decision-points/${decisionPointId}/choices/`, data),
}

// Voting API
export const votingAPI = {
  vote: (storySlug, chapterId, decisionPointId, choiceId) => 
    api.post(`/stories/${storySlug}/chapters/${chapterId}/decision-points/${decisionPointId}/vote/`, {
      choice: choiceId
    }),
}

export default api
