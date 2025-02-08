import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const ContactInfoForm = () => {
  const { user } = useAuth();
  const { loading, error, handleRequest } = useApi();
  const [contactInfo, setContactInfo] = useState({
    whatsapp: user?.contactInfo?.whatsapp || '',
    linkedin: user?.contactInfo?.linkedin || '',
    twitter: user?.contactInfo?.twitter || '',
    preferredContact: user?.contactInfo?.preferredContact || 'email'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRequest(userAPI.updateProfile, { contactInfo });
      alert('Contact information updated successfully!');
    } catch (err) {
      console.error('Error updating contact info:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
        <input
          type="text"
          value={contactInfo.whatsapp}
          onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="+1234567890"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
        <input
          type="url"
          value={contactInfo.linkedin}
          onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Twitter/X Profile</label>
        <input
          type="text"
          value={contactInfo.twitter}
          onChange={(e) => setContactInfo({ ...contactInfo, twitter: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="@username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
        <select
          value={contactInfo.preferredContact}
          onChange={(e) => setContactInfo({ ...contactInfo, preferredContact: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        {loading ? 'Saving...' : 'Save Contact Information'}
      </button>
    </form>
  );
};

export default ContactInfoForm; 