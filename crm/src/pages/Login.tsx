"use client";

import { useState, FormEvent } from 'react';
import getPocketBase from '../api/pocketbase';
import { Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pb = getPocketBase();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await pb.collection('users').authWithPassword(email, password);
      console.log('Login successful!');
      navigate('/dashboard'); // Use navigate to redirect
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

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            id="password1"
            type="password"
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Login;