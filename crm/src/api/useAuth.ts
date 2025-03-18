// useAuth.ts
import { useState } from 'react';
import getPocketBase from '../api/pocketbase';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [error, setError] = useState<string>('');
  const pb = getPocketBase();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setError('');
    try {
      await pb.collection('users').authWithPassword(email, password, {
        requestKey: null, // Prevent auto-cancel
      });
      console.log('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Login error:', err);
      } else {
        setError('An unknown error occurred.');
        console.error('Unknown login error:', err);
      }
    }
  };

  return { login, error };
};