// Login.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useAuth } from '../api/useAuth';
import { LoginForm } from '../components/auth/LoginForm';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <LoginForm
        email={email}
        password={password}
        error={error}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    </div>
  );
}

export default Login;