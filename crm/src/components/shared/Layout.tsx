import { NavbarComponent } from './Navbar';
import { DarkThemeToggle } from "flowbite-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <NavbarComponent />
      <div className="p-4">
        {children}
      </div>
      <div className="absolute top-4 right-4">
        <DarkThemeToggle />
      </div>
    </div>
  );
}