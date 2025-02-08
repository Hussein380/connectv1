import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { mentorshipAPI } from '../services/api';
import { toast } from './ui/Toast';
import { Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';

const MentorContactInfo = ({ mentorId }) => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccessAndLoadContact();
  }, [mentorId]);

  const checkAccessAndLoadContact = async () => {
    try {
      // Check if the mentee has an approved mentorship with this mentor
      const requests = await mentorshipAPI.getMyRequests();
      const approvedRequest = requests.find(
        req => req.mentor._id === mentorId && req.status === 'approved'
      );

      setHasAccess(!!approvedRequest);

      if (approvedRequest) {
        const mentorData = await mentorshipAPI.getMentorContact(mentorId);
        setContactInfo(mentorData.contactInfo);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      toast({
        title: "Error",
        description: "Failed to load mentor contact information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = () => {
    setShowRequestForm(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {hasAccess ? (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
            {contactInfo?.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {contactInfo.email}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {contactInfo?.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {contactInfo.phone}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {contactInfo?.whatsapp && (
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {contactInfo.whatsapp}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Preferred Contact Method:</strong>{' '}
                {contactInfo?.preferredContact || 'Email'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600 mb-4">
              You need to be an approved mentee to view contact information.
            </p>
            <Button onClick={handleRequestMentorship}>
              Request Mentorship
            </Button>
          </div>
        </Card>
      )}

      {showRequestForm && (
        <div className="mt-4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Request Mentorship</h3>
            <MentorshipRequestForm
              mentorId={mentorId}
              onSuccess={() => {
                setShowRequestForm(false);
                toast({
                  title: "Success",
                  description: "Your mentorship request has been sent",
                  variant: "default"
                });
              }}
              onCancel={() => setShowRequestForm(false)}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default MentorContactInfo;
