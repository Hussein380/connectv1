import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/card';
import { Calendar, Clock, Video } from 'lucide-react';

const MentorshipSession = ({ sessionId }) => {
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      const sessionData = await dashboardAPI.getSessionById(sessionId);
      setSession(sessionData);
    } catch (error) {
      console.error('Error fetching session details:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async () => {
    try {
      // Here you would integrate with your video conferencing solution
      // For example, creating a Zoom/Google Meet link
      const updatedSession = await dashboardAPI.joinSession(sessionId);
      setSession(updatedSession);
      
      // Open the meeting link in a new tab
      if (updatedSession.meetingLink) {
        window.open(updatedSession.meetingLink, '_blank');
      }
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  if (loading) {
    return <div>Loading session details...</div>;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  const sessionDate = new Date(session.scheduledAt);
  const isUpcoming = new Date() < sessionDate;
  const canJoin = isUpcoming && new Date() >= new Date(sessionDate - 5 * 60000); // Can join 5 minutes before

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{session.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm ${
          isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isUpcoming ? 'Upcoming' : 'Completed'}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>{sessionDate.toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-5 w-5" />
          <span>{sessionDate.toLocaleTimeString()}</span>
        </div>

        {session.meetingLink && (
          <div className="flex items-center gap-2 text-gray-600">
            <Video className="h-5 w-5" />
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
              Meeting Link
            </a>
          </div>
        )}

        {session.agenda && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Agenda</h3>
            <p className="text-gray-600">{session.agenda}</p>
          </div>
        )}

        {canJoin && (
          <div className="mt-6">
            <Button
              onClick={joinSession}
              className="w-full"
              variant="primary"
            >
              Join Session
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MentorshipSession;
