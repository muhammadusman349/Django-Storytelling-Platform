import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { storyService } from '../services/storyService';
import Settings from '../components/Profile/Settings';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('stories');
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let userData;
                if (username) {
                    // Fetch specific user's profile
                    userData = await authService.getUserByUsername(username);
                } else {
                    // Fetch current user's profile
                    userData = await authService.getCurrentUser();
                    setIsCurrentUser(true);
                }
                setUser(userData);
                setIsFollowing(userData.is_following);

                if (userData) {
                    const userStories = await storyService.getUserStories(userData.username);
                    setStories(userStories.results || []);
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    navigate('/not-found');
                } else {
                    setError(err.message || 'Failed to fetch user data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username, navigate]);

    const handleFollowToggle = async () => {
        if (!user) return;
        
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await authService.unfollowUser(user.username);
                setUser(prev => ({
                    ...prev,
                    followers_count: prev.followers_count - 1
                }));
            } else {
                await authService.followUser(user.username);
                setUser(prev => ({
                    ...prev,
                    followers_count: prev.followers_count + 1
                }));
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            setError(err.detail || 'Failed to toggle follow');
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">{error}</div>
                    <Link to="/" className="text-purple-400 hover:text-purple-300">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                                    {user?.username?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">{user?.username}</h1>
                            <p className="text-gray-400">{user?.bio || 'No bio yet'}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="text-gray-400">
                                    <span className="font-semibold text-white">{stories.length}</span> Stories
                                </div>
                                <div className="text-gray-400">
                                    <span className="font-semibold text-white">{user?.followers_count}</span> Followers
                                </div>
                                <div className="text-gray-400">
                                    <span className="font-semibold text-white">{user?.following_count}</span> Following
                                </div>
                                {!isCurrentUser && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleFollowToggle}
                                        disabled={followLoading}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            isFollowing
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-purple-500 text-white hover:bg-purple-600'
                                        }`}
                                    >
                                        {followLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : isFollowing ? (
                                            'Unfollow'
                                        ) : (
                                            'Follow'
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('stories')}
                            className={`pb-4 px-1 ${
                                activeTab === 'stories'
                                    ? 'border-b-2 border-purple-500 text-purple-400'
                                    : 'text-gray-400 hover:text-gray-300'
                            } transition-colors`}
                        >
                            Stories
                        </button>
                        {isCurrentUser && (
                            <>
                                <button
                                    onClick={() => setActiveTab('drafts')}
                                    className={`pb-4 px-1 ${
                                        activeTab === 'drafts'
                                            ? 'border-b-2 border-purple-500 text-purple-400'
                                            : 'text-gray-400 hover:text-gray-300'
                                    } transition-colors`}
                                >
                                    Drafts
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`pb-4 px-1 ${
                                        activeTab === 'settings'
                                            ? 'border-b-2 border-purple-500 text-purple-400'
                                            : 'text-gray-400 hover:text-gray-300'
                                    } transition-colors`}
                                >
                                    Settings
                                </button>
                            </>
                        )}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'settings' && isCurrentUser ? (
                    <Settings user={user} onUpdate={setUser} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800 rounded-xl overflow-hidden group hover:ring-2 hover:ring-purple-500/50 transition-all"
                            >
                                <div className="relative aspect-[16/9]">
                                    <img
                                        src={story.cover_image || `https://source.unsplash.com/random/800x600?story,${story.id}`}
                                        alt={story.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                                        <Link to={`/stories/${story.slug}`}>{story.title}</Link>
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{story.description}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{new Date(story.created_at).toLocaleDateString()}</span>
                                        <div className="flex items-center space-x-2">
                                            <span>{story.likes_count} likes</span>
                                            <span>•</span>
                                            <span>{story.comments_count} comments</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
