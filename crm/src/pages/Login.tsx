// Login.tsx
"use client";

/**
 * Login page.
 *
 * - Renders a centered login form
 * - Uses `useAuth` to trigger login logic and handle error/loading state
 */

import { useState, FormEvent } from "react";
import { useAuth } from "../api/useAuth";
import { LoginForm } from "../components/auth/LoginForm";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loginError, loginLoading } = useAuth();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <LoginForm
        email={email}
        password={password}
        error={loginError ? loginError.message : ""}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
      {loginLoading && <p>Loading...</p>}
    </div>
  );
}

export default Login;
