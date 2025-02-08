import React from 'react';
import { useNavigate } from 'react-router-dom';
import { opportunityAPI } from '../services/api';
import OpportunityForm from '../components/OpportunityForm';

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleSubmit = async (formData) => {
    try {
      await opportunityAPI.create(formData);
      navigate('/opportunities/manage');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create opportunity');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Opportunity</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow">
        <OpportunityForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateOpportunity; 