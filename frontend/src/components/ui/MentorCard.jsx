import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';
import { Mail, Phone, X, Loader2, User } from 'lucide-react';
import { mentorshipAPI } from '../../services/api';
import { toast } from './Toast';
import { useAuth } from '../../context/AuthContext';

const MentorCard = ({ 
  className,
  backgroundImage = 'https://images.unsplash.com/photo-1544077960-604201fe74bc',
  mentor,
}) => {
  const [showContact, setShowContact] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user, isMentee } = useAuth();

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send connection requests.",
        variant: "destructive"
      });
      return;
    }

    if (!isMentee) {
      toast({
        title: "Access Denied",
        description: "Only mentees can send connection requests.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsConnecting(true);
      const response = await mentorshipAPI.sendRequest({
        mentorId: mentor._id,
        message: `Hi ${mentor.name}, I would like to connect with you as a mentee.`
      });
      
      console.log('Request sent successfully:', response);
      
      toast({
        title: "Request Sent!",
        description: "Your connection request has been sent to the mentor.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send request",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <motion.div 
        className="max-w-xs w-full group/card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`
            cursor-pointer overflow-hidden relative card h-96 rounded-xl shadow-xl 
            max-w-sm mx-auto flex flex-col justify-between p-6 bg-cover bg-center
            ${className}
          `}
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlend: 'overlay'
          }}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover/card:bg-black/70" />
          
          <div className="flex flex-row items-center space-x-4 z-10">
            <div className="h-12 w-12 rounded-full border-2 border-primary/50 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
              {mentor.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-base text-white relative z-10">
                {mentor.name}
              </p>
              <p className="text-sm text-gray-300">{mentor.title}</p>
            </div>
          </div>

          <div className="text content z-10 space-y-3">
            <div className="flex flex-wrap gap-2">
              {mentor.expertise?.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white"
                >
                  {skill}
                </span>
              ))}
              {mentor.expertise?.length > 3 && (
                <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white">
                  +{mentor.expertise.length - 3} more
                </span>
              )}
            </div>
            
            <h2 className="font-bold text-xl text-white relative z-10">
              {mentor.title || 'Mentor'}
            </h2>
            
            <p className="font-normal text-sm text-gray-200 relative z-10 line-clamp-3">
              {mentor.bio || 'Ready to share knowledge and experience with mentees.'}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button 
                onClick={() => setShowContact(true)}
                className="px-4 py-2 bg-primary/90 hover:bg-primary text-white rounded-lg text-sm font-medium transition-colors"
              >
                View Profile
              </button>
              {isMentee && (
                <button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Contact Information</DialogTitle>
              <button 
                onClick={() => setShowContact(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-medium text-lg mb-2">{mentor.name}</h3>
              <p className="text-gray-600">{mentor.title}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-primary" />
                <span>{mentor.contact?.email || mentor.email}</span>
              </div>
              {mentor.contact?.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{mentor.contact.phone}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Areas of Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise?.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {mentor.bio && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-gray-600">{mentor.bio}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MentorCard;
