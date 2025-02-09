import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from './Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';
import { toast } from './Toast';
import { useNavigate } from 'react-router-dom';

const SignInDialog = ({ open, onOpenChange }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', {
        email: formData.email.trim(),
        password: '***'
      });
      
      await login({
        email: formData.email.trim(),
        password: formData.password
      });
      
      onOpenChange(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('SignIn error details:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to sign in",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog; 