import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mentorshipAPI } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Mail, Calendar, CheckCircle2, XCircle, Loader2, User } from 'lucide-react';
import { toast } from '../components/ui/Toast';
import { format } from 'date-fns';

const MentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
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
        description: "Failed to load mentorship requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    if (processingId) return; // Prevent multiple clicks

    try {
      setProcessingId(requestId);
      
      let response;
      if (action === 'accept') {
        response = await mentorshipAPI.acceptRequest(requestId);
        toast({
          title: "Success",
          description: "You have accepted the mentorship request. The mentee will be notified.",
        });
      } else {
        response = await mentorshipAPI.rejectRequest(requestId);
        toast({
          title: "Success",
          description: "You have rejected the mentorship request",
        });
      }

      // Update the local state with the response data
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? response : req
        )
      );
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to process request",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Mentorship Requests</h1>
        <p className="mt-2 text-gray-600">Manage your incoming mentorship requests</p>
      </motion.div>

      <div className="mt-8 space-y-6">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No mentorship requests yet</p>
          </div>
        ) : (
          requests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {request.mentee.name}
                    </h3>
                    <button
                      onClick={() => setSelectedMentee(request.mentee)}
                      className="text-sm text-primary hover:text-primary/80 mt-1"
                    >
                      View Profile
                    </button>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {request.mentee.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{request.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(request.status)}
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="mt-4 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => handleAction(request._id, 'reject')}
                    disabled={!!processingId}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {processingId === request._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(request._id, 'accept')}
                    disabled={!!processingId}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {processingId === request._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Accept
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={!!selectedMentee} onOpenChange={() => setSelectedMentee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mentee Profile</DialogTitle>
          </DialogHeader>
          {selectedMentee && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{selectedMentee.name}</h3>
                <p className="text-gray-600">{selectedMentee.email}</p>
              </div>
              {selectedMentee.bio && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Bio</h4>
                  <p className="mt-1 text-gray-600">{selectedMentee.bio}</p>
                </div>
              )}
              {selectedMentee.interests?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Interests</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMentee.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorshipRequests;