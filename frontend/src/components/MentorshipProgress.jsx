import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { Progress } from './ui/Progress';
import { Card } from './ui/Card';

const MentorshipProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    goals: [],
    completedGoals: 0,
    sessions: [],
    completedSessions: 0,
    overallProgress: 0
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [goals, sessions] = await Promise.all([
        dashboardAPI.getGoals(),
        dashboardAPI.getSessions()
      ]);

      const completedGoals = goals.filter(goal => goal.status === 'completed').length;
      const completedSessions = sessions.filter(session => session.status === 'completed').length;
      
      const overallProgress = calculateOverallProgress(goals, sessions);

      setProgress({
        goals,
        completedGoals,
        sessions,
        completedSessions,
        overallProgress
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const calculateOverallProgress = (goals, sessions) => {
    if (!goals.length && !sessions.length) return 0;
    
    const goalProgress = goals.length ? 
      (goals.filter(goal => goal.status === 'completed').length / goals.length) * 100 : 0;
    
    const sessionProgress = sessions.length ?
      (sessions.filter(session => session.status === 'completed').length / sessions.length) * 100 : 0;

    return Math.round((goalProgress + sessionProgress) / 2);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Mentorship Progress</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
          <Progress value={progress.overallProgress} className="w-full" />
          <p className="text-sm text-gray-600 mt-1">{progress.overallProgress}% Complete</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Goals</h3>
            <p className="text-3xl font-bold">{progress.completedGoals}/{progress.goals.length}</p>
            <p className="text-sm text-gray-600">Goals Completed</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sessions</h3>
            <p className="text-3xl font-bold">{progress.completedSessions}/{progress.sessions.length}</p>
            <p className="text-sm text-gray-600">Sessions Completed</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Goals</h3>
          <div className="space-y-2">
            {progress.goals.slice(0, 3).map(goal => (
              <div key={goal._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{goal.title}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {goal.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MentorshipProgress;