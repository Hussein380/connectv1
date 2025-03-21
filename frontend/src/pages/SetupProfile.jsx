import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mentorAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { toast } from '../components/ui/Toast';
import { Loader2 } from 'lucide-react';

const SetupProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    expertise: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await mentorAPI.getProfile();

      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        expertise: profile.expertise ? profile.expertise.join(', ') : '',
        email: profile.contact?.email || profile.email || '',
        phone: profile.contact?.phone || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);

      // Default to user data from auth context if profile fetch fails
      setFormData({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        expertise: user.expertise ? user.expertise.join(', ') : '',
        email: user.email || '',
        phone: ''
      });

      toast({
        title: "Profile Load Error",
        description: "We couldn't load your saved profile. Starting with basic information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const profileData = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        expertise: formData.expertise.split(',').map(skill => skill.trim()).filter(Boolean),
        contact: {
          email: formData.email,
          phone: formData.phone
        }
      };

      const updatedProfile = await mentorAPI.updateProfile(profileData);
      updateUser({
        ...user,
        ...updatedProfile
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default"
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {formData.title ? 'Edit Your Profile' : 'Setup Your Profile'}
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="title">Professional Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. Senior Software Engineer"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your current role or position
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              placeholder="Write a short bio about yourself"
              className="h-32"
            />
            <p className="text-sm text-gray-500 mt-1">
              Brief description of your background and what you can offer as a mentor
            </p>
          </div>

          <div>
            <Label htmlFor="expertise">Areas of Expertise *</Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              required
              placeholder="e.g. React, Node.js, System Design (comma-separated)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your skills separated by commas
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium">Contact Information</h3>
            <div>
              <Label htmlFor="email">Contact Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Your preferred contact email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your contact phone number"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                formData.title ? 'Save Changes' : 'Create Profile'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile;
