import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { 
  User, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Mail,
  UserPlus,
  UserMinus,
  BookOpen,
  Heart,
  Users,
  Settings,
  Edit
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { profileAPI, storiesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import StoryCard from '../components/Stories/StoryCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const Profile = () => {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('stories')

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery(
    ['profile', username],
    () => profileAPI.getProfile(username),
    { 
      enabled: !!username,
      retry: 1,
      onError: (error) => {
        console.error('Profile fetch error:', error)
        toast.error('Failed to load profile')
      }
    }
  )

  const { data: userStories, isLoading: storiesLoading } = useQuery(
    ['user-stories', username],
    () => storiesAPI.getUserStories(username),
    { enabled: !!username }
  )

  const { data: followers } = useQuery(
    ['followers', username],
    () => profileAPI.getFollowers(username),
    { enabled: !!username }
  )

  const { data: following } = useQuery(
    ['following', username],
    () => profileAPI.getFollowing(username),
    { enabled: !!username }
  )

  const followMutation = useMutation(
    () => profileAPI.followUser(username),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', username])
        queryClient.invalidateQueries(['followers', username])
        toast.success('User followed successfully!')
      },
      onError: () => {
        toast.error('Failed to follow user')
      }
    }
  )

  const unfollowMutation = useMutation(
    () => profileAPI.unfollowUser(username),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', username])
        queryClient.invalidateQueries(['followers', username])
        toast.success('User unfollowed successfully!')
      },
      onError: () => {
        toast.error('Failed to unfollow user')
      }
    }
  )

  const handleFollow = () => {
    if (!currentUser) {
      toast.error('Please login to follow users')
      return
    }
    
    if (profile?.is_following) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  const isOwnProfile = currentUser?.username === username

  const tabs = [
    { id: 'stories', label: 'Stories', icon: BookOpen, count: userStories?.length || 0 },
    { id: 'followers', label: 'Followers', icon: Users, count: followers?.length || 0 },
    { id: 'following', label: 'Following', icon: Heart, count: following?.length || 0 }
  ]

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
          <p className="text-gray-400 mb-6">The user you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>
              {profile.is_online && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {profile.first_name && profile.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile.username
                    }
                  </h1>
                  <p className="text-gray-400">@{profile.username}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {isOwnProfile ? (
                    <Link to="/dashboard">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </motion.button>
                    </Link>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFollow}
                      disabled={followMutation.isLoading || unfollowMutation.isLoading}
                      className={`btn flex items-center space-x-2 ${
                        profile.is_following
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'btn-primary'
                      }`}
                    >
                      {profile.is_following ? (
                        <>
                          <UserMinus className="h-4 w-4" />
                          <span>Unfollow</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          <span>Follow</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-300 mb-4">{profile.bio}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDistanceToNow(new Date(profile.date_joined), { addSuffix: true })}</span>
                </div>
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-primary-400 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>Website</span>
                  </a>
                )}
                {profile.email && isOwnProfile && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

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
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
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
                  <p className="text-gray-400">
                    {isOwnProfile 
                      ? "You haven't created any stories yet. Start writing your first story!"
                      : "This user hasn't published any stories yet."
                    }
                  </p>
                  {isOwnProfile && (
                    <Link to="/stories/create" className="btn-primary mt-4">
                      Create Your First Story
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userStories?.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div>
              {followers?.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Followers</h3>
                  <p className="text-gray-400">
                    {isOwnProfile 
                      ? "You don't have any followers yet. Keep creating great content!"
                      : "This user doesn't have any followers yet."
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followers?.map((follower) => (
                    <div key={follower.id} className="card">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                          {follower.avatar ? (
                            <img
                              src={follower.avatar}
                              alt={follower.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            follower.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/profile/${follower.username}`}
                            className="font-medium text-white hover:text-primary-400 transition-colors"
                          >
                            {follower.first_name && follower.last_name
                              ? `${follower.first_name} ${follower.last_name}`
                              : follower.username
                            }
                          </Link>
                          <p className="text-sm text-gray-400">@{follower.username}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div>
              {following?.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Not Following Anyone</h3>
                  <p className="text-gray-400">
                    {isOwnProfile 
                      ? "You're not following anyone yet. Discover amazing writers to follow!"
                      : "This user isn't following anyone yet."
                    }
                  </p>
                  {isOwnProfile && (
                    <Link to="/stories" className="btn-primary mt-4">
                      Discover Writers
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {following?.map((followedUser) => (
                    <div key={followedUser.id} className="card">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                          {followedUser.avatar ? (
                            <img
                              src={followedUser.avatar}
                              alt={followedUser.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            followedUser.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/profile/${followedUser.username}`}
                            className="font-medium text-white hover:text-primary-400 transition-colors"
                          >
                            {followedUser.first_name && followedUser.last_name
                              ? `${followedUser.first_name} ${followedUser.last_name}`
                              : followedUser.username
                            }
                          </Link>
                          <p className="text-sm text-gray-400">@{followedUser.username}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
