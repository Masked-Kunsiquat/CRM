// Navbar.tsx
import { Link } from "react-router-dom";
import { Navbar } from "flowbite-react";
import { useAuth } from "./AuthContext";
import { DarkThemeToggle } from "flowbite-react";

export function NavbarComponent() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} to="/organizations">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CRM App
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/organizations" active>
          Organizations
        </Navbar.Link>
        {user && (
          <>
            <Navbar.Link as={Link} to="/dashboard">
              Dashboard
            </Navbar.Link>
            <Navbar.Link onClick={logout}>Logout</Navbar.Link>
          </>
        )}
        {!user && (
          <Navbar.Link as={Link} to="/login">
            Login
          </Navbar.Link>
        )}
        <DarkThemeToggle /> {/* Moved inside Navbar */}
      </Navbar.Collapse>
    </Navbar>
  );
}