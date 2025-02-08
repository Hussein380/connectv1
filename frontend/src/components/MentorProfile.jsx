import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { mentorAPI } from '../services/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Calendar, Mail, Phone, Globe, BookOpen, Award, Clock } from 'lucide-react';

const MentorProfile = ({ isEditing = false }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    bio: user?.bio || '',
    expertise: user?.expertise || [],
    availability: user?.availability || '',
    education: user?.education || [],
    experience: user?.experience || [],
    contactPreferences: user?.contactPreferences || {},
    achievements: user?.achievements || []
  });
  const [isEditable, setIsEditable] = useState(isEditing);

  const handleSave = async () => {
    try {
      await mentorAPI.updateProfile(profile);
      setIsEditable(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddExpertise = (expertise) => {
    setProfile(prev => ({
      ...prev,
      expertise: [...prev.expertise, expertise]
    }));
  };

  const handleRemoveExpertise = (index) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = (education) => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, education]
    }));
  };

  const handleAddExperience = (experience) => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, experience]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-gray-600">{user?.title}</p>
          </div>
          {!isEditable && (
            <Button onClick={() => setIsEditable(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Bio Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">About Me</h2>
        {isEditable ? (
          <Textarea
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full"
            rows={4}
          />
        ) : (
          <p className="text-gray-700">{profile.bio}</p>
        )}
      </Card>

      {/* Expertise */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Areas of Expertise</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.expertise.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {item}
              {isEditable && (
                <button
                  onClick={() => handleRemoveExpertise(index)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
        </div>
        {isEditable && (
          <div className="flex gap-2">
            <Input
              placeholder="Add expertise"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddExpertise(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        )}
      </Card>

      {/* Availability */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Availability</h2>
        </div>
        {isEditable ? (
          <Textarea
            value={profile.availability}
            onChange={(e) => setProfile(prev => ({ ...prev, availability: e.target.value }))}
            className="w-full"
            placeholder="Describe your availability (e.g., 'Available weekdays after 5 PM EST')"
          />
        ) : (
          <p className="text-gray-700">{profile.availability}</p>
        )}
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Education</h2>
        </div>
        <div className="space-y-4">
          {profile.education.map((edu, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.year}</p>
            </div>
          ))}
          {isEditable && (
            <Button
              variant="outline"
              onClick={() => handleAddEducation({
                degree: '',
                institution: '',
                year: ''
              })}
            >
              Add Education
            </Button>
          )}
        </div>
      </Card>

      {/* Experience */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Experience</h2>
        </div>
        <div className="space-y-4">
          {profile.experience.map((exp, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.duration}</p>
              <p className="text-gray-700 mt-2">{exp.description}</p>
            </div>
          ))}
          {isEditable && (
            <Button
              variant="outline"
              onClick={() => handleAddExperience({
                title: '',
                company: '',
                duration: '',
                description: ''
              })}
            >
              Add Experience
            </Button>
          )}
        </div>
      </Card>

      {/* Contact Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Preferences</h2>
        {isEditable ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={profile.contactPreferences.email}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  contactPreferences: {
                    ...prev.contactPreferences,
                    email: e.target.value
                  }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                type="tel"
                value={profile.contactPreferences.phone}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  contactPreferences: {
                    ...prev.contactPreferences,
                    phone: e.target.value
                  }
                }))}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <span>{profile.contactPreferences.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <span>{profile.contactPreferences.phone}</span>
            </div>
          </div>
        )}
      </Card>

      {isEditable && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsEditable(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default MentorProfile;