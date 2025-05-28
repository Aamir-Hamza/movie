import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Film, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const { login, user, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  // Demo account login
  const handleDemoLogin = async () => {
    const success = await login('user@example.com', 'password123');
    if (success) {
      navigate('/');
    }
  };

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background-dark">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-primary-900/60 p-3 rounded-full">
            <Film className="h-8 w-8 text-primary-400" />
          </div>
        </div>
        
        <div className="bg-background-card rounded-lg shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Sign in to CinemaHub</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                error={formErrors.email}
                autoComplete="email"
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={formErrors.password}
                autoComplete="current-password"
              />
              
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="mt-6"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary-400 hover:text-primary-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background-card text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Demo Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};