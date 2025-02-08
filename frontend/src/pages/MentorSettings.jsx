import React from 'react';
import { useAuth } from '../context/AuthContext';
import ContactSettings from '../components/ContactSettings';

const MentorSettings = () => {
    const { user } = useAuth();

    if (!user || user.role !== 'mentor') {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl text-red-600">Access Denied</h2>
                <p className="text-gray-600">Only mentors can access this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Mentor Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <ContactSettings />
            </div>
        </div>
    );
};

export default MentorSettings; 