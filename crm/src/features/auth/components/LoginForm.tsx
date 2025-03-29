// LoginForm.tsx
import { Button, Label, TextInput } from "flowbite-react";
import { LoginFormProps } from "../types";

/**
 * A controlled login form component.
 *
 * - Accepts external state for `email`, `password`, and `error`
 * - Calls `setEmail` and `setPassword` on input changes
 * - Invokes `onSubmit` handler when the form is submitted
 * - Displays validation error (if provided) at the top
 *
 * @param {LoginFormProps} props - Props for managing form state and handlers
 * @returns {JSX.Element} A styled login form
 */
export const LoginForm = ({ 
  email, 
  password, 
  error, 
  setEmail, 
  setPassword, 
  onSubmit 
}: LoginFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-md bg-white p-6 shadow-md"
    >
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput
          id="email1"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
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
          placeholder="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="mt-4 w-full">
        Submit
      </Button>
    </form>
  );
};
