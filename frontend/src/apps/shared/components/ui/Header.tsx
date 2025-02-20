import { Link } from "react-router-dom";
import { DarkThemeToggle } from "flowbite-react";

const Header = () => {
  return (
    <header className="flex w-full justify-between items-center mb-6">
      {/* Clicking this will navigate to the main dashboard */}
      <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:underline">
        Swiss-Army App
      </Link>
      <DarkThemeToggle />
    </header>
  );
};

export default Header;
