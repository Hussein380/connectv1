import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mentorshipAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { ExternalLink, Mail, Phone, MessageSquare } from 'lucide-react';

const MyMentorshipRequests = () => {
    const { user } = useAuth();
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
            toast({
                title: "Error",
                description: "Failed to fetch requests",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Mentorship Requests</h1>

            {requests.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No mentorship requests yet</p>
                    <Button
                        className="mt-4"
                        onClick={() => window.location.href = '/opportunities'}
                    >
                        Browse Opportunities
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {requests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white p-6 rounded-lg shadow-sm border"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            Request to {request.mentor.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Sent on {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2 text-gray-600">
                                            <MessageSquare className="w-5 h-5 mt-1 flex-shrink-0" />
                                            <p>{request.message}</p>
                                        </div>

                                        {request.status === 'accepted' && request.notes && (
                                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                                <h4 className="font-medium text-green-800 mb-2">
                                                    Response from {request.mentor.name}
                                                </h4>
                                                <p className="text-green-700 whitespace-pre-line">
                                                    {request.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    {getStatusBadge(request.status)}
                                    
                                    {request.status === 'accepted' && request.mentor.contact && (
                                        <div className="flex flex-col items-end gap-2">
                                            {request.mentor.contact.whatsapp && (
                                                <a
                                                    href={`https://wa.me/${request.mentor.contact.whatsapp}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
                                                >
                                                    <span>WhatsApp</span>
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                            {request.mentor.contact.email && (
                                                <a
                                                    href={`mailto:${request.mentor.contact.email}`}
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                                >
                                                    <span>Email</span>
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                            {request.mentor.contact.phone && (
                                                <a
                                                    href={`tel:${request.mentor.contact.phone}`}
                                                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                                                >
                                                    <span>Phone</span>
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
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

export default MyMentorshipRequests;