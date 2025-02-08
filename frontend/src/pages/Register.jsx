import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import AuthLayout from '../components/AuthLayout';
import { toast } from '../components/ui/Toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'mentee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };
      await authAPI.register(userData);
      toast({
        title: "Success",
        description: "Account created successfully",
        variant: "default"
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-[95vw] sm:max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join our community of mentors and mentees</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm"
              placeholder="Create a password"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">I want to join as</Label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="mentee">Student (Mentee)</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Already have an account? <span className="font-medium">Sign in</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;