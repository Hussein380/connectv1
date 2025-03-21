import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { Progress } from './ui/Progress';
import { Card } from './ui/Card';
import { Check, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const MentorshipProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    goals: [],
    completedGoals: 0,
    sessions: [],
    completedSessions: 0,
    overallProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10 p-6 rounded-xl shadow-md animate-pulse">
        <div className="h-5 bg-white/10 rounded-full w-1/2 mb-4"></div>
        <div className="h-3 bg-white/10 rounded-full w-full mb-8"></div>
        <div className="h-10 bg-white/10 rounded-lg w-full mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-white/10 rounded-full w-3/4 mb-2"></div>
            <div className="h-6 bg-white/10 rounded-full w-1/2 mb-1"></div>
            <div className="h-3 bg-white/10 rounded-full w-2/3"></div>
          </div>
          <div>
            <div className="h-4 bg-white/10 rounded-full w-3/4 mb-2"></div>
            <div className="h-6 bg-white/10 rounded-full w-1/2 mb-1"></div>
            <div className="h-3 bg-white/10 rounded-full w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-white/5 border-white/10 p-6 rounded-xl shadow-md backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Mentorship Progress</h2>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-blue-100">Overall Progress</h3>
            <span className="text-sm font-medium text-blue-200">{progress.overallProgress}%</span>
          </div>
          <Progress value={progress.overallProgress} className="w-full bg-white/10"
            indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold text-blue-100 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" /> Goals
              </h3>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium">
                {progress.completedGoals}/{progress.goals.length}
              </span>
            </div>
            <div className="mt-2">
              <Progress
                value={(progress.completedGoals / Math.max(1, progress.goals.length)) * 100}
                className="w-full h-2 bg-white/10"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold text-blue-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" /> Sessions
              </h3>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-200 rounded-full text-xs font-medium">
                {progress.completedSessions}/{progress.sessions.length}
              </span>
            </div>
            <div className="mt-2">
              <Progress
                value={(progress.completedSessions / Math.max(1, progress.sessions.length)) * 100}
                className="w-full h-2 bg-white/10"
                indicatorClassName="bg-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-semibold text-blue-100 mb-3">Recent Goals</h3>
          <div className="space-y-2">
            {progress.goals.slice(0, 3).map(goal => (
              <div key={goal._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-blue-100">{goal.title}</span>
                <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${goal.status === 'completed'
                    ? 'bg-green-500/20 text-green-200'
                    : 'bg-yellow-500/20 text-yellow-200'
                  }`}>
                  {goal.status === 'completed' && <Check className="h-3 w-3" />}
                  {goal.status}
                </span>
              </div>
            ))}

            {progress.goals.length === 0 && (
              <div className="text-center py-6 text-blue-200 bg-white/5 rounded-lg border border-white/10">
                No goals set yet
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MentorshipProgress;