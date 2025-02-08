import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LampContainer } from '../components/ui/Lamp';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0">
                <LampContainer />
            </div>

            <div className="relative z-10">
                {/* Navigation */}
                <nav className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Scholars Connect</h1>
                        <div className="space-x-2 md:space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm text-blue-100 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="container mx-auto px-4 pt-12 pb-24 md:pt-24 md:pb-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h2
                            className="text-4xl md:text-6xl font-bold text-white mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Connect with Mentors,<br />
                            Shape Your Future
                        </motion.h2>
                        <motion.p
                            className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Find mentorship opportunities, connect with experienced professionals,
                            and take your academic journey to the next level.
                        </motion.p>
                        <motion.div
                            className="space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Link
                                to="/register?role=mentee"
                                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Find a Mentor
                            </Link>
                            <Link
                                to="/register?role=mentor"
                                className="inline-block px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                                Become a Mentor
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h3 className="text-xl font-semibold text-white mb-3">Find Opportunities</h3>
                            <p className="text-blue-100">
                                Discover mentorship opportunities tailored to your academic goals and interests.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h3 className="text-xl font-semibold text-white mb-3">Connect & Learn</h3>
                            <p className="text-blue-100">
                                Connect with experienced mentors and learn from their expertise and guidance.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <h3 className="text-xl font-semibold text-white mb-3">Track Progress</h3>
                            <p className="text-blue-100">
                                Set goals, track your progress, and celebrate your achievements along the way.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing; 