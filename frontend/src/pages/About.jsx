import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    const features = [
        {
            title: 'Share Your Stories',
            description: 'Write and share your unique stories with our global community of readers and writers.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
        {
            title: 'Connect with Writers',
            description: 'Follow your favorite authors and engage with a community of passionate storytellers.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            title: 'Discover New Worlds',
            description: 'Explore stories across different genres and immerse yourself in new perspectives.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <div className="relative py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-gray-900 to-gray-900"></div>
                    <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                </div>
                <div className="relative container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                            About Story Sharing Platform
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            We're building a community where stories come to life and connections are made through the power of storytelling.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Our Mission
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            We believe that everyone has a story worth sharing. Our platform is designed to empower writers
                            and readers alike, creating a space where creativity flourishes and connections are made through
                            the art of storytelling.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="btn btn-primary">
                                Start Writing
                            </button>
                            <button className="btn btn-secondary">
                                Learn More
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-20 bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-gray-400">
                            The passionate individuals behind our platform
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[1, 2, 3].map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gray-800 rounded-xl p-6 text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-purple-500/20 mx-auto mb-4"></div>
                                <h3 className="text-lg font-semibold text-white mb-1">Team Member {index + 1}</h3>
                                <p className="text-gray-400 text-sm">Position</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
