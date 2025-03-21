import React from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { mentorshipAPI } from '../services/api';
import MentorProfileComponent from '../components/MentorProfile';
import MentorContactInfo from '../components/MentorContactInfo';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

const MentorProfileSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="h-7 bg-white/10 rounded-md w-48 animate-pulse"></div>
                            <div className="h-5 bg-white/10 rounded-md w-32 animate-pulse"></div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10">
                    <div className="h-6 bg-white/10 rounded-md w-36 mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded-md w-full animate-pulse"></div>
                        <div className="h-4 bg-white/10 rounded-md w-full animate-pulse"></div>
                        <div className="h-4 bg-white/10 rounded-md w-3/4 animate-pulse"></div>
                    </div>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10">
                    <div className="h-6 bg-white/10 rounded-md w-56 mb-4 animate-pulse"></div>
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-6 bg-white/10 rounded-full px-4 animate-pulse w-24"></div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10">
                    <div className="h-6 bg-white/10 rounded-md w-36 mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded-md w-full animate-pulse"></div>
                        <div className="h-4 bg-white/10 rounded-md w-2/3 animate-pulse"></div>
                    </div>
                </Card>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
                <Card className="p-6 bg-white/5 border-white/10">
                    <div className="h-6 bg-white/10 rounded-md w-36 mb-4 animate-pulse"></div>
                    <div className="space-y-4">
                        <div className="h-10 bg-white/10 rounded-md w-full animate-pulse"></div>
                        <div className="h-10 bg-white/10 rounded-md w-full animate-pulse"></div>
                    </div>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10">
                    <div className="h-6 bg-white/10 rounded-md w-36 mb-4 animate-pulse"></div>
                    <div className="space-y-4">
                        <div>
                            <div className="h-4 bg-white/10 rounded-md w-24 mb-1 animate-pulse"></div>
                            <div className="h-6 bg-white/10 rounded-md w-8 animate-pulse"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-white/10 rounded-md w-32 mb-1 animate-pulse"></div>
                            <div className="h-6 bg-white/10 rounded-md w-8 animate-pulse"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-white/10 rounded-md w-28 mb-1 animate-pulse"></div>
                            <div className="h-6 bg-white/10 rounded-md w-12 animate-pulse"></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
);

const MentorProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { handleRequest } = useApi();
    const [mentor, setMentor] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        fetchMentorProfile();
    }, [id]);

    const fetchMentorProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await handleRequest(() => mentorshipAPI.getMentorProfile(id));
            setMentor(data);
        } catch (error) {
            console.error('Error fetching mentor profile:', error);
            setError('Could not load mentor profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <MentorProfileSkeleton />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-6 bg-red-500/10 border border-red-500/20 text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Error Loading Profile</h2>
                    <p className="text-red-200">{error}</p>
                    <button
                        onClick={fetchMentorProfile}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                        Try Again
                    </button>
                </Card>
            </div>
        );
    }

    if (!mentor) return <div>No mentor found with this ID.</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Content */}
                <div className="lg:col-span-2">
                    <MentorProfileComponent
                        mentor={mentor}
                        isViewOnly={true}
                    />
                </div>

                {/* Sidebar with Contact Info and Request Option */}
                <div className="space-y-6">
                    {user?.role === 'mentee' && (
                        <MentorContactInfo mentorId={id} />
                    )}

                    {/* Additional Mentor Stats */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <h3 className="text-xl font-semibold mb-4 text-white">Mentor Stats</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-blue-200">Active Mentees</p>
                                <p className="text-2xl font-bold text-white">{mentor.stats?.activeMentees || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-200">Total Sessions</p>
                                <p className="text-2xl font-bold text-white">{mentor.stats?.totalSessions || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-200">Average Rating</p>
                                <p className="text-2xl font-bold text-white">{mentor.stats?.averageRating || 'N/A'}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default MentorProfile;