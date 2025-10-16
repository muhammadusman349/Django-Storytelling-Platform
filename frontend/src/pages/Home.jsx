import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  Zap, 
  Heart, 
  ArrowRight,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'
import { useQuery } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { storiesAPI } from '../services/api'
import StoryCard from '../components/Stories/StoryCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const { data: featuredStories, isLoading } = useQuery(
    'featured-stories',
    () => storiesAPI.getStories({ limit: 6 }),
    { staleTime: 5 * 60 * 1000 }
  )

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Stories',
      description: 'Create branching narratives where readers shape the story through their choices.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with fellow storytellers and readers in a vibrant creative community.'
    },
    {
      icon: Zap,
      title: 'Real-time Decisions',
      description: 'Vote on story directions and see the narrative evolve based on community choices.'
    },
    {
      icon: Heart,
      title: 'Engaging Experience',
      description: 'Immerse yourself in stories that adapt and respond to your preferences.'
    }
  ]

  const stats = [
    { icon: BookOpen, label: 'Stories Created', value: '1,234+' },
    { icon: Users, label: 'Active Writers', value: '567+' },
    { icon: Heart, label: 'Community Votes', value: '8,900+' },
    { icon: Award, label: 'Featured Stories', value: '156' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-gray-900 to-secondary-900/20"></div>
        <div className="container mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Where Stories
              <span className="gradient-text"> Come Alive</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create interactive stories where every choice matters. Join a community of writers and readers shaping narratives together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary btn-lg"
                >
                  Start Writing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
              <Link to="/stories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline btn-lg"
                >
                  Explore Stories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-primary-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="gradient-text">StoryVerse</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience storytelling like never before with our innovative platform designed for creators and readers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center"
              >
                <feature.icon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-xl text-gray-300">
              Discover amazing interactive stories from our community
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {(Array.isArray(featuredStories) ? featuredStories : featuredStories?.results)?.slice(0, 6).map((story) => (
                  <StoryCard key={story.id} story={story} viewMode="grid" />
                ))}
              </div>
              <div className="text-center">
                <Link to="/stories">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline"
                  >
                    View All Stories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your <span className="gradient-text">Story</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of writers and readers creating the next generation of interactive storytelling.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary btn-lg"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
