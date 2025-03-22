import { useState, useEffect } from 'react'; // Import useEffect
import getPocketBase from '../api/pocketbase';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const pb = getPocketBase();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from auth store on mount
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError('');
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, {
        requestKey: null,
      });
      setUser(authData?.record);
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

  const logout = async () => {
    pb.authStore.clear();
    setUser(null);
    navigate('/login');
  };

  return { login, error, user, logout };
};