import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/react-query";
import { ToastProvider } from "./apps/shared/components/ux/ToastContext";
import AppRoutes from "./routes";
import Header from "./apps/shared/components/ui/Header"; // Import Header

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <main className="flex flex-col min-h-screen dark:bg-gray-800 p-6">
          <Header /> {/* Centralized header for all pages */}
          <AppRoutes />
        </main>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
