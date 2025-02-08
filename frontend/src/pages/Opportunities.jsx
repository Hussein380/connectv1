import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { opportunityAPI, mentorshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Share2, Bell, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Opportunities = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const { loading, error, handleRequest } = useApi();
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    deadline: 'all'
  });

  const opportunityTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'scholarship', label: 'Scholarship' },
    { value: 'internship', label: 'Internship' },
    { value: 'research', label: 'Research' },
    { value: 'job', label: 'Job' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [filters, opportunities]);

  const fetchOpportunities = async () => {
    try {
      const data = await handleRequest(opportunityAPI.getAll);
      setOpportunities(data);
      setFilteredOpportunities(data);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    }
  };

  const filterOpportunities = () => {
    let filtered = [...opportunities];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(opp => opp.type === filters.type);
    }

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        opp.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by deadline
    if (filters.deadline === 'upcoming') {
      const oneWeek = new Date();
      oneWeek.setDate(oneWeek.getDate() + 7);
      filtered = filtered.filter(opp => 
        new Date(opp.deadline) <= oneWeek && new Date(opp.deadline) >= new Date()
      );
    }

    setFilteredOpportunities(filtered);
  };

  const handleRequestMentorship = async (mentorId) => {
    try {
      const message = prompt('Enter your message to the mentor:');
      if (message) {
        await handleRequest(mentorshipAPI.sendRequest, mentorId, { message });
        alert('Mentorship request sent successfully!');
      }
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  const handleShare = async (opportunity) => {
    try {
      await navigator.share({
        title: opportunity.title,
        text: opportunity.description,
        url: opportunity.applicationLink
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleSubscribe = async (opportunityId) => {
    try {
      await handleRequest(opportunityAPI.subscribe, opportunityId);
      alert('You will receive notifications for this opportunity');
    } catch (err) {
      console.error('Error subscribing:', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Opportunities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <motion.div
            key={opportunity._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {opportunity.title}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {opportunity.description}
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="text-sm text-gray-500">
                  Posted by: {opportunity.mentor.name}
                </div>
                
                <div className="flex justify-end">
                  {opportunity.applicationLink && (
                    <a
                      href={opportunity.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No opportunities available at the moment.
        </div>
      )}
    </div>
  );
};

export default Opportunities; 