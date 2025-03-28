import { Link, useLocation } from "react-router-dom";
import { Navbar } from "flowbite-react";
import { useAuth } from "../../features/auth/api/useAuth";
import { DarkThemeToggle } from "flowbite-react";

/**
 * App-wide navigation bar component.
 *
 * - Shows login/logout options based on auth state
 * - Highlights the active route based on `useLocation`
 * - Includes a dark mode toggle using Flowbite's `DarkThemeToggle`
 * - Displays a "Dashboard" link only when authenticated
 *
 * @returns {JSX.Element} A responsive navbar with routing and theme support
 */
export function NavbarComponent() {
  const { user, logout, loginLoading } = useAuth();
  const location = useLocation();

  if (loginLoading) {
    return <div className="p-2 dark:text-white">Loading...</div>;
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} to="/organizations">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CRM App
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          as={Link}
          to="/organizations"
          active={isActive("/organizations")}
        >
          Organizations
        </Navbar.Link>
        {user ? (
          <>
            <Navbar.Link
              as={Link}
              to="/dashboard"
              active={isActive("/dashboard")}
            >
              Dashboard
            </Navbar.Link>
            <Navbar.Link onClick={logout}>Logout</Navbar.Link>
          </>
        ) : (
          <Navbar.Link as={Link} to="/login" active={isActive("/login")}>
            Login
          </Navbar.Link>
        )}
        <div className="ml-2 flex items-center">
          <DarkThemeToggle aria-label="Toggle dark mode" />
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
