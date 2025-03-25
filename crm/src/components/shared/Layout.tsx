// Layout.tsx
import { NavbarComponent } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

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
