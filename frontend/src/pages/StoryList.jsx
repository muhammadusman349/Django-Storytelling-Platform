import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyService } from '../services/storyService';

const StoryList = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        sort: 'newest'
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await storyService.getAllStories({
                    category: filters.category !== 'all' ? filters.category : undefined,
                    sort: filters.sort,
                    search: searchQuery
                });
                setStories(response.results || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch stories');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [filters, searchQuery]);

    const categories = [
        { id: 'all', name: 'All Stories' },
        { id: 'adventure', name: 'Adventure' },
        { id: 'mystery', name: 'Mystery' },
        { id: 'romance', name: 'Romance' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'scifi', name: 'Sci-Fi' }
    ];

    const sortOptions = [
        { id: 'newest', name: 'Newest First' },
        { id: 'popular', name: 'Most Popular' },
        { id: 'trending', name: 'Trending' }
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <div className="relative py-16 bg-gradient-to-b from-gray-800 to-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
                        >
                            Discover Amazing Stories
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-300 mb-8"
                        >
                            Explore a world of captivating narratives written by our community
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search stories..."
                                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center py-4 space-y-4 md:space-y-0">
                        {/* Categories */}
                        <div className="flex items-center space-x-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setFilters({ ...filters, category: category.id })}
                                    className={`px-4 py-2 rounded-lg ${
                                        filters.category === category.id
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    } transition-all whitespace-nowrap`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stories Grid */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-400 text-xl mb-4">{error}</div>
                        <button
                            onClick={() => setLoading(true)}
                            className="text-purple-400 hover:text-purple-300"
                        >
                            Try Again
                        </button>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-xl mb-4">No stories found</div>
                        <p className="text-gray-500">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {stories.map((story) => (
                            <motion.div
                                key={story.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 }
                                }}
                                className="bg-gray-800 rounded-xl overflow-hidden group hover:transform hover:scale-105 transition-all duration-300"
                            >
                                <Link to={`/stories/${story.slug}`}>
                                    <div className="relative aspect-[16/9]">
                                        <img
                                            src={story.cover_image || `https://source.unsplash.com/random/800x600?story,${story.id}`}
                                            alt={story.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 text-sm bg-purple-500/20 rounded-full text-purple-300">
                                                {story.category || "Adventure"}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
                                            {story.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {story.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-semibold mr-2">
                                                    {story.author_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{story.author_name}</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span>{story.likes_count} likes</span>
                                                <time dateTime={story.created_at}>
                                                    {new Date(story.created_at).toLocaleDateString()}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default StoryList;
