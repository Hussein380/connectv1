import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mentorshipAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { ExternalLink, Mail, MessageSquare, Phone, BookOpen, Activity, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MentorshipProgress from '../components/MentorshipProgress';

const MenteeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    } finally {
      setLoading(false);
    }
  };

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
      opacity: 1
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 pt-20"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-3">Active Mentors</h3>
              <p className="text-blue-100">Connect with experienced professionals</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <Activity className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Active Requests</h3>
              <p className="text-blue-200">{requests.filter(r => r.status === 'pending').length} pending</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <Users className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Accepted Mentorships</h3>
              <p className="text-blue-200">{requests.filter(r => r.status === 'accepted').length} active</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <BookOpen className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Opportunities</h3>
              <Button
                onClick={() => navigate('/opportunities')}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Browse All
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-3"
        >
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Mentorship Requests</h2>
              <Button
                onClick={() => navigate('/mentorship/my-requests')}
                variant="ghost"
                className="text-blue-400 hover:text-blue-300"
                size="sm"
              >
                See all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              {requests.slice(0, 3).map((request) => (
                <motion.div
                  key={request._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Request to {request.mentorId.name}
                      </h3>
                      <p className="text-blue-200 mt-1">
                        For: {request.opportunityId.title}
                      </p>
                      <p className="mt-3 text-blue-100">{request.message}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`
                        px-4 py-1 rounded-full text-sm font-medium
                        ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-200' :
                          request.status === 'accepted' ? 'bg-green-500/20 text-green-200' :
                            'bg-red-500/20 text-red-200'}
                      `}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {request.status === 'accepted' && request.mentorId.contactInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <h4 className="font-medium text-white mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        {request.mentorId.contactInfo.whatsapp && (
                          <a
                            href={`https://wa.me/${request.mentorId.contactInfo.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-green-300 hover:text-green-200"
                          >
                            <Phone className="h-4 w-4" />
                            <span>Contact via WhatsApp</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={`mailto:${request.mentorId.email}`}
                          className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Contact via Email</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {requests.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12 bg-white/5 rounded-2xl border border-white/10"
                >
                  <p className="text-blue-200 mb-4">You haven't sent any mentorship requests yet.</p>
                  <Button
                    onClick={() => navigate('/opportunities')}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Browse Opportunities
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Progress Tracking Section */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>
            <MentorshipProgress />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenteeDashboard; 