import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyService } from '../services/storyService';

const StoryEdit = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        cover_image: null,
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const story = await storyService.getStoryBySlug(slug);
                setFormData({
                    title: story.title,
                    description: story.description,
                    content: story.content,
                    cover_image: null,
                });
                setPreview(story.cover_image);
            } catch (err) {
                setError(err.message || 'Failed to fetch story');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStory();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'cover_image' && files?.length) {
            setFormData(prev => ({
                ...prev,
                cover_image: files[0]
            }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            await storyService.updateStory(slug, formData);
            navigate(`/stories/${slug}`);
        } catch (err) {
            setError(err.message || 'Failed to update story. Please try again.');
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Edit Story
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image Upload */}
                    <div className="relative">
                        <div className="aspect-[21/9] rounded-xl overflow-hidden bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center group">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Click or drag to upload a new cover image
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="cover_image"
                                accept="image/*"
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Enter your story title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Write a brief description of your story"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
                            Story Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            value={formData.content}
                            onChange={handleChange}
                            rows={12}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Write your story here..."
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => navigate(`/stories/${slug}`)}
                            className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="space-x-4">
                            <button
                                type="button"
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this story?')) {
                                        try {
                                            await storyService.deleteStory(slug);
                                            navigate('/profile');
                                        } catch (err) {
                                            setError(err.message || 'Failed to delete story');
                                        }
                                    }
                                }}
                                className="px-6 py-3 rounded-xl text-red-400 hover:text-red-300 transition-colors"
                            >
                                Delete
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Save Changes'
                                )}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default StoryEdit;
