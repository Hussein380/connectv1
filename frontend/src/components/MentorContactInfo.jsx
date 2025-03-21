import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { mentorshipAPI } from '../services/api';
import { toast } from './ui/Toast';
import { Mail, Phone, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';

const ContactInfoSkeleton = () => (
  <Card className="p-6 bg-white/5 border-white/10">
    <div className="h-6 bg-white/10 rounded-md w-48 mb-4 animate-pulse"></div>
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="h-5 w-5 bg-white/10 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded-md w-16 animate-pulse"></div>
          <div className="h-5 bg-white/10 rounded-md w-40 animate-pulse"></div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="h-5 w-5 bg-white/10 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded-md w-16 animate-pulse"></div>
          <div className="h-5 bg-white/10 rounded-md w-36 animate-pulse"></div>
        </div>
      </div>
      <div className="h-16 bg-white/10 rounded-md w-full animate-pulse"></div>
    </div>
  </Card>
);

const MentorContactInfo = ({ mentorId }) => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    checkAccessAndLoadContact();
  }, [mentorId]);

  const checkAccessAndLoadContact = async () => {
    try {
      setLoading(true);
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

  const handleRequestMentorship = async () => {
    try {
      setSendingRequest(true);
      // Check if there's already a pending request
      const requests = await mentorshipAPI.getMyRequests();
      const pendingRequest = requests.find(
        req => req.mentor._id === mentorId && req.status === 'pending'
      );

      if (pendingRequest) {
        toast({
          title: "Request Already Sent",
          description: "You already have a pending request with this mentor",
          variant: "default"
        });
        return;
      }

      setShowRequestForm(true);
    } catch (error) {
      console.error('Error checking existing requests:', error);
      toast({
        title: "Error",
        description: "Could not process your request",
        variant: "destructive"
      });
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return <ContactInfoSkeleton />;
  }

  return (
    <div className="space-y-4">
      {hasAccess ? (
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-white">Contact Information</h3>
          <div className="space-y-4">
            {contactInfo?.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-200">Email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                    aria-label={`Email ${contactInfo.email}`}
                  >
                    {contactInfo.email}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {contactInfo?.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-200">Phone</p>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                    aria-label={`Phone ${contactInfo.phone}`}
                  >
                    {contactInfo.phone}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {contactInfo?.whatsapp && (
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-blue-200">WhatsApp</p>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 hover:underline flex items-center gap-1"
                    aria-label={`WhatsApp ${contactInfo.whatsapp}`}
                  >
                    {contactInfo.whatsapp}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Preferred Contact Method:</strong>{' '}
                {contactInfo?.preferredContact || 'Email'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-white/5 border-white/10">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-white">Contact Information</h3>
            <p className="text-blue-200 mb-4">
              You need to be an approved mentee to view contact information.
            </p>
            <Button
              onClick={handleRequestMentorship}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={sendingRequest}
              aria-label="Request mentorship"
            >
              {sendingRequest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Request Mentorship'
              )}
            </Button>
          </div>
        </Card>
      )}

      {showRequestForm && (
        <div className="mt-4">
          <Card className="p-6 bg-white/5 border-white/10">
            <h3 className="text-xl font-semibold mb-4 text-white">Request Mentorship</h3>
            <div className="text-center py-4">
              <p className="text-blue-200 mb-4">
                To request mentorship, please send a message describing your goals and why you'd like to be mentored.
              </p>
              <Button
                onClick={() => {
                  toast({
                    title: "Request Sent",
                    description: "Your mentorship request has been submitted.",
                    variant: "default"
                  });
                  setShowRequestForm(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 mr-2"
              >
                Send Request
              </Button>
              <Button
                onClick={() => setShowRequestForm(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MentorContactInfo;
