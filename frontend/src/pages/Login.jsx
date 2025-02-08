import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import AuthLayout from '../components/AuthLayout';
import { toast } from '../components/ui/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };
      
      await login(payload);
      toast({
        title: "Success",
        description: "Logged in successfully",
        variant: "default"
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message ||
        'Unable to connect to server. Please try again later.'
      );
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to login",
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/register" 
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Don't have an account? <span className="font-medium">Register</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;