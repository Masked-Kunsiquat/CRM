import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import getPocketBase from '../api/pocketbase';
import { RecordAuthResponse, RecordModel } from 'pocketbase';

const pb = getPocketBase();

interface User extends RecordModel {
  email: string;
  username?: string;
  // add other known user fields here if needed
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(
    pb.authStore.isValid ? (pb.authStore.model as User) : null
  );

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_, model) => {
      setUser(model as User);
    });

    return () => unsubscribe();
  }, []);

  const loginMutation = useMutation<RecordAuthResponse<User>, Error, LoginCredentials>({
    mutationFn: ({ email, password }) =>
      pb.collection('users').authWithPassword<User>(email, password, {
        requestKey: null, // 🚩 Prevent autocancellation
      }),

    onSuccess: (authData) => {
      setUser(authData.record);
      console.log('Login successful!');
      navigate('/dashboard');
      queryClient.invalidateQueries();
    },

    onError: (err: Error) => {
      console.error('Login error:', err);
    },
  });

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    queryClient.clear();
    navigate('/login');
  };

  return {
    user,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    loginLoading: loginMutation.isPending,
    logout,
  };
};
