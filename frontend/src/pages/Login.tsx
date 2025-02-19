import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, Label, TextInput, Alert, DarkThemeToggle } from "flowbite-react";

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/dashboard"); // Redirect on successful login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end">
          <DarkThemeToggle />
        </div>

        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h2>
        {error && <Alert color="failure">{error}</Alert>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="text-gray-900 dark:text-white">Password</Label>
            <TextInput
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
