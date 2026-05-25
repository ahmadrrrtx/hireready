// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
      addToast({ type: 'success', title: 'Welcome back!', message: 'Successfully logged in.' });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Login Failed', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <Card variant="bordered" className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="glass-input w-full"
                required
              />
            </div>
            <Button type="submit" isLoading={isLoading} variant="primary" fullWidth>
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/signup" className="text-purple-400 hover:text-purple-300">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
