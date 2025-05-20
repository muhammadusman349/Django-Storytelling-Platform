import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center space-x-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                        >
                            StoryVerse
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link 
                            to="/" 
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/stories" 
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Browse Stories
                        </Link>
                        <Link 
                            to="/about" 
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            About Us
                        </Link>
                        {isAuthenticated ? (
                            <div className="relative">
                                <motion.button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span>{user?.username || 'User'}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800 border border-white/10 shadow-lg py-1"
                                        >
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Your Profile
                                            </Link>
                                            <Link
                                                to="/stories/create"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Create Story
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        Sign In
                                    </motion.button>
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                                    >
                                        Get Started
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/10"
                        >
                            <div className="py-4 space-y-4">
                                <Link 
                                    to="/stories" 
                                    className="block text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Browse Stories
                                </Link>
                                <Link 
                                    to="/about" 
                                    className="block text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="block text-gray-300 hover:text-white transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/stories/create"
                                            className="block text-gray-300 hover:text-white transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Create Story
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block text-gray-300 hover:text-white transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-left text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <Link
                                            to="/login"
                                            className="block text-gray-300 hover:text-white transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;
