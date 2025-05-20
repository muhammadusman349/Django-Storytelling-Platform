import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../services/authService';

const StoryList = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/stories/');
            setStories(response.data);
        } catch (err) {
            setError('Failed to load stories');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg text-gray-600">Loading stories...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-8">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
                {authService.isAuthenticated() && (
                    <Link
                        to="/stories/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Write a Story
                    </Link>
                )}
            </div>

            {stories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No stories available yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    <Link
                                        to={`/stories/${story.slug}`}
                                        className="hover:text-indigo-600"
                                    >
                                        {story.title}
                                    </Link>
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {story.description}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <div>By {story.author_name}</div>
                                    <div>{new Date(story.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3">
                                <Link
                                    to={`/stories/${story.slug}`}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                >
                                    Read more →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoryList;
