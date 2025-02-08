import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { opportunityAPI, mentorAPI } from '../services/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Users, Briefcase, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user.role === 'mentor') {
          const profile = await mentorAPI.getProfile();
          if (profile) {
            // updateUser({
            //   ...user,
            //   ...profile
            // });
          }
        }

        const opportunitiesData = await opportunityAPI.getAll();
        setOpportunities(opportunitiesData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.role, user._id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          {user.role === 'mentor' 
            ? 'Share your expertise and guide the next generation'
            : 'Find mentors and opportunities to grow your skills'}
        </p>
      </motion.div>

      {user.role === 'mentor' && (
        <motion.div 
          variants={itemVariants}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div 
            onClick={() => navigate('/setup-profile')}
            className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white dark:bg-gray-800 rounded-xl p-8 cursor-pointer transform transition duration-500 hover:scale-[1.02]"
          >
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.bio && user.title && user.expertise?.length > 0 
                    ? 'Your Mentor Profile'
                    : 'Complete Your Profile'}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {user.bio && user.title && user.expertise?.length > 0 
                  ? 'Keep your profile updated to attract the right mentees'
                  : 'Help students find you by sharing your expertise and experience'}
              </p>
              
              {user.bio && user.title && user.expertise?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <GraduationCap className="h-4 w-4" />
                    {user.expertise.length} Areas of Expertise
                  </div>
                  {user.contact?.phone && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                      <Users className="h-4 w-4" />
                      Contact Ready
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    <Briefcase className="h-4 w-4" />
                    {user.title}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 sm:self-center">
              <span className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
                {user.bio && user.title && user.expertise?.length > 0 
                  ? 'Edit Profile'
                  : 'Setup Profile'}
              </span>
              <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>
      )}

      {user.role === 'mentor' && (
        <Link
          to="/mentorship-requests"
          className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Mentorship Requests</h3>
            <p className="text-sm text-gray-500">View and manage incoming mentorship requests</p>
          </div>
        </Link>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {user.role === 'mentor' ? 'Your Opportunities' : 'Available Opportunities'}
          </h2>
          {opportunities.length > 0 ? (
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <motion.div 
                  key={opportunity._id}
                  variants={itemVariants}
                  className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-all duration-300"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    {opportunity.description}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No opportunities available at the moment.</p>
          )}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-300">Opportunities</p>
              <p className="text-3xl font-bold text-primary mt-2">{opportunities.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {opportunities.filter(o => o.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-4"></div>
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-8"></div>
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-200 dark:bg-gray-700">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;