import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../../services/authService';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [userStories, setUserStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        bio: ''
    });

    useEffect(() => {
        fetchProfileData();
        fetchUserStories();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/profile/', {
                headers: {
                    'Authorization': `Bearer ${authService.getCurrentUser()?.access}`
                }
            });
            setProfile(response.data);
            setFormData({
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || '',
                email: response.data.email || '',
                bio: response.data.bio || ''
            });
        } catch (err) {
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/stories/', {
                headers: {
                    'Authorization': `Bearer ${authService.getCurrentUser()?.access}`
                },
                params: {
                    author: authService.getCurrentUser()?.id
                }
            });
            setUserStories(response.data);
        } catch (err) {
            console.error('Failed to load user stories');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8000/api/auth/profile/update/', formData, {
                headers: {
                    'Authorization': `Bearer ${authService.getCurrentUser()?.access}`
                }
            });
            setEditMode(false);
            fetchProfileData();
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center py-8">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Profile</h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-900"
                    >
                        {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                                <p className="mt-1">{profile.username}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1">{profile.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="mt-1">
                                    {profile.first_name} {profile.last_name}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                                <p className="mt-1">
                                    {new Date(profile.date_joined).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        {profile.bio && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                                <p className="mt-1">{profile.bio}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">My Stories</h2>
                {userStories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userStories.map(story => (
                            <div key={story.id} className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{story.description}</p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Created: {new Date(story.created_at).toLocaleDateString()}</span>
                                    <a
                                        href={`/stories/${story.slug}`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View Story →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No stories created yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
