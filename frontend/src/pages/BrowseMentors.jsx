import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mentorshipAPI } from '../services/api';
import MentorCard from '../components/ui/MentorCard';
import { Search } from 'lucide-react';

const BrowseMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await mentorshipAPI.getAllMentors();
        setMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise?.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return <MentorListSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Find Your Perfect Mentor
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Connect with experienced mentors who can guide you on your journey
        </p>
      </motion.div>

      <div className="relative max-w-xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, title, or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      >
        {filteredMentors.map((mentor, index) => (
          <MentorCard
            key={mentor._id}
            mentor={mentor}
            backgroundImage={`https://source.unsplash.com/random/400x600?education,${index}`}
          />
        ))}
      </motion.div>

      {filteredMentors.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-gray-600">
            No mentors found matching your search criteria.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const MentorListSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="h-10 w-1/3 bg-gray-200 rounded-lg mx-auto mb-4"></div>
    <div className="h-6 w-1/2 bg-gray-200 rounded-lg mx-auto mb-12"></div>
    <div className="max-w-xl mx-auto h-12 bg-gray-200 rounded-xl mb-12"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      ))}
    </div>
  </div>
);

export default BrowseMentors;
