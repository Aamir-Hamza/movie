import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/movie';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: Record<string, { password: string; user: User }> = {
  'user@example.com': {
    password: 'password123',
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const userRecord = mockUsers[email.toLowerCase()];
      
      if (!userRecord || userRecord.password !== password) {
        setError('Invalid email or password');
        setIsLoading(false);
        return false;
      }
      
      setUser(userRecord.user);
      localStorage.setItem('user', JSON.stringify(userRecord.user));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const emailLower = email.toLowerCase();
      
      if (mockUsers[emailLower]) {
        setError('Email already exists');
        setIsLoading(false);
        return false;
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: emailLower,
        name,
      };
      
      // In a real app, this would be saved to a database
      mockUsers[emailLower] = {
        password,
        user: newUser,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred during signup');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};