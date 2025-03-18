import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations'; // Import Organizations component
import OrgDetail from './pages/OrgDetail';
import getPocketBase from './api/pocketbase';
import { DarkThemeToggle } from "flowbite-react";

function App() {
  const pb = getPocketBase();
  const isAuthenticated = pb.authStore.isValid;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
            path="/organizations"
            element={isAuthenticated ? <Organizations /> : <Navigate to="/login" />}
        />
        <Route
            path="/organizations/:id"
            element={isAuthenticated ? <OrgDetail /> : <Navigate to="/login" />}
        />        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
      <div className="absolute top-4 right-4">
        <DarkThemeToggle />
      </div>
    </Router>
  );
}

export default App;