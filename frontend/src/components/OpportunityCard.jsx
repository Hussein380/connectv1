import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { toast } from './ui/Toast';
import MentorshipRequestForm from './MentorshipRequestForm';
import { ExternalLink, Send, Mail, Phone, User } from 'lucide-react';

const OpportunityCard = ({ opportunity }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showRequestForm, setShowRequestForm] = React.useState(false);
    const [showMentorProfile, setShowMentorProfile] = React.useState(false);

    // Debug log
    console.log('Opportunity Mentor:', opportunity.mentor);

    const handleMentorClick = () => {
        console.log('Mentor clicked, showing profile dialog');
        setShowMentorProfile(true);
    };

    const handleRequestClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowRequestForm(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="p-6">
                {/* Title and Posted By */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                            <span>Posted by:</span>
                            <button
                                type="button"
                                onClick={handleMentorClick}
                                className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer select-none"
                            >
                                <User className="h-4 w-4" />
                                <span className="font-medium">{opportunity.mentor.name}</span>
                            </button>
                        </div>
                    </div>
                    <span className="text-sm text-gray-500">
                        {new Date(opportunity.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4">{opportunity.description}</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                    <Button
                        variant="outline"
                        onClick={() => window.open(opportunity.applicationLink || '#', '_blank')}
                        className="flex items-center gap-2"
                        disabled={!opportunity.applicationLink}
                    >
                        <ExternalLink className="h-4 w-4" />
                        Apply Now
                    </Button>

                    {user?.role === 'mentee' && (
                        <Button
                            onClick={handleRequestClick}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Send className="h-4 w-4" />
                            Request Mentorship
                        </Button>
                    )}

                    <div className="ml-auto text-sm text-gray-500">
                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Mentor Profile Dialog */}
            <Dialog open={showMentorProfile} onOpenChange={setShowMentorProfile}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Mentor Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Mentor Basic Info */}
                        <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{opportunity.mentor.name}</h3>
                                <p className="text-gray-600">{opportunity.mentor.email}</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Contact Information</h4>
                            <div className="space-y-3">
                                {opportunity.mentor.contactInfo?.whatsapp && (
                                    <a
                                        href={`https://wa.me/${opportunity.mentor.contactInfo.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-green-700 hover:text-green-800"
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span>Contact via WhatsApp</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                                <a
                                    href={`mailto:${opportunity.mentor.email}`}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                >
                                    <Mail className="h-4 w-4" />
                                    <span>Contact via Email</span>
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Action Button */}
                        {user?.role === 'mentee' && (
                            <Button
                                onClick={() => {
                                    setShowMentorProfile(false);
                                    handleRequestClick();
                                }}
                                className="w-full"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Request Mentorship
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Request Form Dialog */}
            <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Mentorship for {opportunity.title}</DialogTitle>
                    </DialogHeader>
                    <MentorshipRequestForm
                        mentorId={opportunity.mentor._id}
                        opportunityId={opportunity._id}
                        onSuccess={() => {
                            setShowRequestForm(false);
                            toast({
                                title: "Success",
                                description: "Mentorship request sent successfully!",
                                variant: "default"
                            });
                        }}
                        onCancel={() => setShowRequestForm(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OpportunityCard; 