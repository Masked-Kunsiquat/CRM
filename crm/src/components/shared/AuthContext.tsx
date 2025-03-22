import React, { createContext, useState, useEffect, useContext } from 'react';
import getPocketBase from '../../api/pocketbase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pb = getPocketBase();
  const navigate = useNavigate();

  useEffect(() => {
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setError('');
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, {
        requestKey: null,
      });
      setUser(authData?.record);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};