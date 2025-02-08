import React from 'react';
import { mentorshipAPI } from '../services/api';
import { Button } from './ui/Button';

const MenteeRequests = () => {
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await mentorshipAPI.getMyRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded text-sm ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Mentorship Requests</h2>

            {requests.length === 0 ? (
                <p className="text-gray-500">You haven't sent any mentorship requests yet</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{request.mentorId.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Sent on {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="mt-2">{request.message}</p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {getStatusBadge(request.status)}

                                    {request.status === 'accepted' && (
                                        <Button
                                            onClick={() => window.location.href = `/mentors/${request.mentorId._id}`}
                                        >
                                            View Mentor Profile
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenteeRequests; 