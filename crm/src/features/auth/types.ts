// src/features/auth/types.ts
import { RecordModel } from "pocketbase";

/**
 * Extended user model for authenticated users.
 */
export interface User extends RecordModel {
  email: string;
  username?: string;
  // Add other known user fields here if needed
}

/**
 * Structure for login credentials.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Props for the LoginForm component.
 */
export interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Return type for the useAuth hook.
 */
export interface AuthHookReturn {
  user: User | null;
  login: (credentials: LoginCredentials) => void;
  loginError: Error | null;
  loginLoading: boolean;
  logout: () => void;
}