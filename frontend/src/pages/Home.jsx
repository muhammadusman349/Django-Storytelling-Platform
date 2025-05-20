import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { storyService } from '../services/storyService';

const Home = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await storyService.getAllStories();
                setStories(data.results || []);
                setLoading(false);
            } catch (err) {
                setError(err.detail || 'Failed to fetch stories');
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerChildren = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90"></div>
                    <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
                </div>
                
                <motion.div 
                    className="relative container mx-auto px-4 py-32"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1 
                            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Craft Your Epic Tale
                        </motion.h1>
                        <motion.p 
                            className="mt-6 text-xl md:text-2xl text-gray-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Create immersive stories where every choice shapes the narrative. Join a community of storytellers and bring your imagination to life.
                        </motion.p>
                        <motion.div 
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            {isAuthenticated ? (
                                <Link
                                    to="/stories/create"
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-purple-500/20 hover:scale-105 transform transition-all duration-300"
                                >
                                    Start Creating
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-purple-500/20 hover:scale-105 transform transition-all duration-300"
                                    >
                                        Begin Your Journey
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute -bottom-1 left-0 right-0">
                    <svg className="w-full h-24 fill-gray-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
                    </svg>
                </div>
            </div>

            {/* Featured Stories Section */}
            <motion.div 
                className="relative bg-gray-900 py-24"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerChildren}
            >
                <div className="container mx-auto px-4">
                    <motion.div 
                        className="text-center mb-16"
                        variants={fadeInUp}
                    >
                        <h2 className="text-4xl font-bold mb-4">Featured Stories</h2>
                        <p className="text-xl text-gray-400">Discover captivating narratives from our community</p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="relative w-20 h-20">
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-purple-500/20 animate-ping"></div>
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <motion.div 
                            className="text-center text-red-400 py-12"
                            variants={fadeInUp}
                        >
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-lg">{error}</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    variants={fadeInUp}
                                    className="group relative bg-gray-800 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative aspect-[4/3]">
                                        <img
                                            src={story.cover_image || `https://source.unsplash.com/random/800x600?story,${index}`}
                                            alt={story.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                                    </div>
                                    <div className="relative p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 text-sm bg-purple-500/20 rounded-full text-purple-300">
                                                {story.category || "Adventure"}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                                            <Link to={`/stories/${story.slug}`} className="block">
                                                {story.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {story.description || "Embark on an exciting journey through this captivating tale..."}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>By {story.author_name}</span>
                                            <time dateTime={story.created_at}>
                                                {new Date(story.created_at).toLocaleDateString()}
                                            </time>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
                className="relative py-24 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90"></div>
                    <div className="absolute inset-0 bg-[url('/images/cta-pattern.svg')] opacity-10"></div>
                </div>
                <div className="relative container mx-auto px-4 text-center">
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Ready to Write Your Story?
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Join our community of storytellers and start creating immersive narratives that captivate readers.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        {isAuthenticated ? (
                            <Link
                                to="/stories/create"
                                className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                            >
                                Create Your Story
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                            >
                                Join the Community
                            </Link>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
