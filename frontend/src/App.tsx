import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/react-query";
import { ToastProvider } from "./apps/shared/components/ux/ToastContext";
import AppRoutes from "./routes";
import Header from "./apps/shared/components/ui/Header";
import GlobalSidebar from "./apps/shared/components/ui/GlobalSidebar"; // Import Sidebar

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="flex min-h-screen dark:bg-gray-800">
          {/* Sidebar */}
          <GlobalSidebar />

          {/* Main Content */}
          <main className="flex flex-col flex-grow p-6">
            <Header />
            <AppRoutes />
          </main>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
