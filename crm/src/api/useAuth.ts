import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import getPocketBase from "../api/pocketbase";
import { RecordAuthResponse, RecordModel } from "pocketbase";

const pb = getPocketBase();

/**
 * Extended user model for authenticated users.
 */
interface User extends RecordModel {
  email: string;
  username?: string;
  // Add other known user fields here if needed
}

/**
 * Structure for login credentials.
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Custom hook to manage user authentication.
 *
 * - Handles login and logout flows
 * - Syncs auth state with PocketBase's auth store
 * - Exposes current user, login mutation state, and logout function
 *
 * @returns {{
 *   user: User | null,
 *   login: (credentials: LoginCredentials) => void,
 *   loginError: Error | null,
 *   loginLoading: boolean,
 *   logout: () => void
 * }}
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Initialize user state from PocketBase auth store
  const [user, setUser] = useState<User | null>(
    pb.authStore.isValid ? (pb.authStore.model as User) : null,
  );

  // Listen for auth store changes and update local state
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_, model) => {
      setUser(model as User);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Mutation to handle user login with email and password.
   */
  const loginMutation = useMutation<
    RecordAuthResponse<User>,
    Error,
    LoginCredentials
  >({
    mutationFn: ({ email, password }) =>
      pb.collection("users").authWithPassword<User>(email, password, {
        requestKey: null, // 🚩 Prevent autocancellation
      }),

    onSuccess: (authData) => {
      setUser(authData.record);
      console.log("Login successful!");
      navigate("/dashboard");
      queryClient.invalidateQueries();
    },

    onError: (err: Error) => {
      console.error("Login error:", err);
    },
  });

  /**
   * Logs the user out and clears auth data and cached queries.
   */
  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    queryClient.clear();
    navigate("/login");
  };

  return {
    user,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    loginLoading: loginMutation.isPending,
    logout,
  };
};
