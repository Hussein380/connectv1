import React from 'react';
import { Users, BookOpen, MessageSquare } from 'lucide-react';
import StatCard from './ui/StatCard';
import { useAuth } from '../context/AuthContext';

const DashboardHeader = ({ stats }) => {
    const { user } = useAuth();

    return (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 rounded-2xl mb-6">
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}! 👋</h1>
            <p className="text-blue-100 mt-2">Here's what's happening with your mentorship journey.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <StatCard
                    icon={<Users className="h-6 w-6" />}
                    title="Active Mentors"
                    value={stats?.activeMentors || '0'}
                />
                <StatCard
                    icon={<BookOpen className="h-6 w-6" />}
                    title="Opportunities"
                    value={stats?.opportunities || '0'}
                />
                <StatCard
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="Messages"
                    value={stats?.messages || '0'}
                />
            </div>
        </div>
    );
};

export default DashboardHeader; 