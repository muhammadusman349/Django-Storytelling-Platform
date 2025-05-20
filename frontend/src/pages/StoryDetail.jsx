import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyService } from '../services/storyService';
import { authService } from '../services/authService';

const StoryDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const data = await storyService.getStoryBySlug(slug);
                setStory(data);
                setIsLiked(data.is_liked);
            } catch (err) {
                setError(err.message || 'Failed to fetch story');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [slug]);

    const handleLike = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            await storyService.likeStory(story.id);
            setIsLiked(!isLiked);
            setStory(prev => ({
                ...prev,
                likes_count: isLiked ? prev.likes_count - 1 : prev.likes_count + 1
            }));
        } catch (err) {
            console.error('Failed to like story:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">{error || 'Story not found'}</div>
                    <Link to="/" className="text-purple-400 hover:text-purple-300">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <div className="absolute inset-0">
                    <img
                        src={story.cover_image || `https://source.unsplash.com/random/1920x1080?story`}
                        alt={story.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900"></div>
                </div>
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl"
                        >
                            {story.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 flex items-center space-x-4 text-gray-300"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                                    {story.author_name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="ml-2">{story.author_name}</span>
                            </div>
                            <span>•</span>
                            <time dateTime={story.created_at}>
                                {new Date(story.created_at).toLocaleDateString()}
                            </time>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="prose prose-lg prose-invert max-w-none"
                    >
                        <p className="text-xl text-gray-300 mb-8">{story.description}</p>
                        <div className="text-gray-200 whitespace-pre-wrap">{story.content}</div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex items-center justify-between border-t border-gray-800 pt-6"
                    >
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                                    isLiked
                                        ? 'text-pink-400 bg-pink-500/10'
                                        : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                                } transition-all`}
                            >
                                <svg
                                    className={`w-6 h-6 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span>{story.likes_count}</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                <span>Share</span>
                            </button>
                        </div>
                        {currentUser?.id === story.author && (
                            <Link
                                to={`/stories/${slug}/edit`}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Edit Story
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;
