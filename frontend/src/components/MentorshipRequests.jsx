import React from 'react';
import { mentorshipAPI } from '../services/api';
import { Button } from './ui/Button';
import { toast } from './ui/Toast';
import { Check, X, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const MentorshipRequests = ({ requests = [] }) => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await mentorshipAPI.getRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast({
                title: "Error",
                description: "Failed to fetch mentorship requests",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRequestUpdate = async (requestId, status) => {
        try {
            await mentorshipAPI.updateRequest(requestId, { status });
            toast({
                title: "Success",
                description: `Request ${status} successfully`,
                variant: "default"
            });
            fetchRequests(); // Refresh the list
        } catch (error) {
            console.error('Error updating request:', error);
            toast({
                title: "Error",
                description: "Failed to update request",
                variant: "destructive"
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request, index) => (
                <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-medium text-gray-900">{request.mentee.name}</h3>
                                <p className="text-sm text-gray-500">{request.mentee.email}</p>
                            </div>
                            <span className={`
                                px-2 py-1 text-xs rounded-full
                                ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'}
                            `}>
                                {request.status}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm flex-grow mb-4">
                            {request.message}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {request.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleRequestUpdate(request._id, 'accepted')}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRequestUpdate(request._id, 'rejected')}
                                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                                    >
                                        Decline
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default MentorshipRequests; 