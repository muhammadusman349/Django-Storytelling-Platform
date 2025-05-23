import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-xl">
                            StoryTelling
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/"
                                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/stories"
                                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Stories
                                </Link>
                                {isAuthenticated && (
                                    <Link
                                        to="/stories/create"
                                        className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Write Story
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/profile"
                                        className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                    <span className="text-white text-sm">
                                        Welcome, {currentUser?.username}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
