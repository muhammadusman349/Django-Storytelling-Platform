import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, BookOpen } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-gray-900 to-secondary-900/20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-2xl mx-auto"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-8xl md:text-9xl font-bold gradient-text mb-4">
            404
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center mb-6"
          >
            <BookOpen className="h-24 w-24 text-primary-400" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Oops! The story you're looking for seems to have taken an unexpected plot twist. 
            This page doesn't exist in our narrative universe.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
              >
                <Home className="h-5 w-5" />
                <span>Back to Home</span>
              </motion.button>
            </Link>
            
            <Link to="/stories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline flex items-center space-x-2 w-full sm:w-auto"
              >
                <Search className="h-5 w-5" />
                <span>Browse Stories</span>
              </motion.button>
            </Link>
          </div>

          {/* Go Back Button */}
          <div className="pt-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go back to previous page</span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl -z-10"></div>
      </motion.div>
    </div>
  )
}

export default NotFound
