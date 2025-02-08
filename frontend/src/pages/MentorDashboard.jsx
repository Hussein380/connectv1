import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, mentorAPI, opportunityAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/progress';
import { Users, BookOpen, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeMentees: 0,
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: [],
    menteeProgress: [],
    opportunities: []
  });

  useEffect(() => {
    fetchMentorStats();
  }, []);

  const fetchMentorStats = async () => {
    try {
      const [dashboardStats, opportunities] = await Promise.all([
        dashboardAPI.getMentorStats(),
        opportunityAPI.getMentorOpportunities()
      ]);

      setStats({
        ...dashboardStats,
        opportunities
      });
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
        <Link to="/opportunities/create">
          <Button>Create New Opportunity</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Mentees"
          value={stats.activeMentees}
          icon={Users}
        />
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon={Calendar}
          description={`${stats.completedSessions} completed`}
        />
        <StatCard
          title="Active Opportunities"
          value={stats.opportunities.length}
          icon={BookOpen}
        />
        <StatCard
          title="Average Mentee Progress"
          value={`${calculateAverageProgress(stats.menteeProgress)}%`}
          icon={Target}
        />
      </div>

      {/* Upcoming Sessions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
        <div className="space-y-4">
          {stats.upcomingSessions.map(session => (
            <div key={session._id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">{session.mentee.name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(session.scheduledAt).toLocaleString()}
                </p>
              </div>
              <Link to={`/sessions/${session._id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          ))}
          {stats.upcomingSessions.length === 0 && (
            <p className="text-gray-500">No upcoming sessions</p>
          )}
        </div>
      </Card>

      {/* Mentee Progress */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Mentee Progress</h2>
        <div className="space-y-6">
          {stats.menteeProgress.map(mentee => (
            <div key={mentee._id} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">{mentee.name}</p>
                <p className="text-sm text-gray-600">{mentee.progress}%</p>
              </div>
              <Progress value={mentee.progress} className="w-full" />
            </div>
          ))}
          {stats.menteeProgress.length === 0 && (
            <p className="text-gray-500">No active mentees</p>
          )}
        </div>
      </Card>

      {/* Active Opportunities */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Opportunities</h2>
        <div className="space-y-4">
          {stats.opportunities.map(opportunity => (
            <div key={opportunity._id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">{opportunity.title}</p>
                <p className="text-sm text-gray-600">
                  {opportunity.applicants?.length || 0} applicants
                </p>
              </div>
              <div className="space-x-2">
                <Link to={`/opportunities/${opportunity._id}/applications`}>
                  <Button variant="outline">View Applications</Button>
                </Link>
                <Link to={`/opportunities/${opportunity._id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const calculateAverageProgress = (menteeProgress) => {
  if (!menteeProgress.length) return 0;
  const total = menteeProgress.reduce((sum, mentee) => sum + mentee.progress, 0);
  return Math.round(total / menteeProgress.length);
};

export default MentorDashboard;
