import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../services/authService';

const StoryDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchStory();
    }, [slug]);

    const fetchStory = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/stories/${slug}/`);
            setStory(response.data);
        } catch (err) {
            setError('Failed to load story');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this story?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/v1/stories/${slug}/`, {
                headers: {
                    'Authorization': `Bearer ${authService.getCurrentUser()?.access}`
                }
            });
            navigate('/stories');
        } catch (err) {
            setError('Failed to delete story');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg text-gray-600">Loading story...</div>
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

    if (!story) {
        return (
            <div className="text-center py-8">
                Story not found
            </div>
        );
    }

    const isAuthor = currentUser && story.author === currentUser.id;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <article className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {story.title}
                        </h1>
                        {isAuthor && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate(`/stories/${slug}/edit`)}
                                    className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-sm text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-8">
                        <span>By {story.author_name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(story.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">
                            {story.description}
                        </p>
                    </div>
                </div>

                {story.chapters && story.chapters.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>
                        <div className="space-y-6">
                            {story.chapters.map((chapter) => (
                                <div key={chapter.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {chapter.title}
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        {chapter.content}
                                    </p>
                                    {chapter.decision_points && chapter.decision_points.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-lg font-medium mb-2">Decision Points</h4>
                                            {chapter.decision_points.map((point) => (
                                                <div key={point.id} className="bg-gray-50 p-4 rounded-md">
                                                    <p className="font-medium mb-2">{point.question}</p>
                                                    <div className="space-y-2">
                                                        {point.choices.map((choice) => (
                                                            <div key={choice.id} className="flex items-center">
                                                                <span className="text-gray-700">{choice.text}</span>
                                                                <span className="ml-2 text-sm text-gray-500">
                                                                    ({choice.votes} votes)
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default StoryDetail;
