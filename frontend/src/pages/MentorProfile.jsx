import React from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { mentorshipAPI } from '../services/api';
import MentorProfileComponent from '../components/MentorProfile';
import MentorContactInfo from '../components/MentorContactInfo';
import { Card } from '../components/ui/Card';

const MentorProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { handleRequest, loading } = useApi();
    const [mentor, setMentor] = React.useState(null);

    React.useEffect(() => {
        fetchMentorProfile();
    }, [id]);

    const fetchMentorProfile = async () => {
        try {
            const data = await handleRequest(() => mentorshipAPI.getMentorProfile(id));
            setMentor(data);
        } catch (error) {
            console.error('Error fetching mentor profile:', error);
        }
    };

    if (loading || !mentor) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
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
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Mentor Stats</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Active Mentees</p>
                                <p className="text-2xl font-bold">{mentor.stats?.activeMentees || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Sessions</p>
                                <p className="text-2xl font-bold">{mentor.stats?.totalSessions || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Average Rating</p>
                                <p className="text-2xl font-bold">{mentor.stats?.averageRating || 'N/A'}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MentorProfile;