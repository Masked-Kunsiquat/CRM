import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import OrgDetail from './pages/OrgDetail';
import { Layout } from './components/shared/Layout';

export function RoutesConfig() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={<Layout><Dashboard /></Layout>}
      />
      <Route
        path="/organizations"
        element={<Layout><Organizations /></Layout>}
      />
      <Route
        path="/organizations/:id"
        element={<Layout><OrgDetail /></Layout>}
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}