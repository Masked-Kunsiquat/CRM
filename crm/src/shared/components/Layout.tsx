// Layout.tsx
import { NavbarComponent } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout wrapper with top navbar and padded content area.
 *
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} A page layout with navigation and children
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <NavbarComponent />
      <div className="dark:bg-gray-800">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
