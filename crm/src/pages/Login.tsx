// Login.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useAuth } from '../api/useAuth';
import { LoginForm } from '../components/auth/LoginForm';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loginError, loginLoading } = useAuth();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <LoginForm
        email={email}
        password={password}
        error={loginError ? loginError.message : ''}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
      {loginLoading && <p>Loading...</p>}
    </div>
  );
}

export default Login;
