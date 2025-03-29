import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Organizations from "./features/organizations/pages/Organizations";
import OrgDetail from "./features/organizations/pages/OrgDetail";
import CreateOrganization from "./features/organizations/components/CreateOrganization";
import EditOrganization from "./features/organizations/components/EditOrganization";
import AccountDetail from "./features/accounts/pages/AccountDetail";
import SubAccountDetail from "./features/subaccounts/pages/SubaccountDetail";
import { Layout } from "./shared/components/Layout";
import { NotificationProvider } from "./shared/components/NotificationContext";

export function RoutesConfig() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Organization Routes */}
        <Route
          path="/organizations"
          element={
            <Layout>
              <Organizations />
            </Layout>
          }
        />
        <Route
          path="/organizations/create"
          element={
            <Layout>
              <CreateOrganization />
            </Layout>
          }
        />
        <Route
          path="/organizations/:id"
          element={
            <Layout>
              <OrgDetail />
            </Layout>
          }
        />
        <Route
          path="/organizations/:id/edit"
          element={
            <Layout>
              <EditOrganization />
            </Layout>
          }
        />

        {/* Account Routes */}
        <Route
          path="/accounts/:id"
          element={
            <Layout>
              <AccountDetail />
            </Layout>
          }
        />

        {/* Subaccount Routes */}
        <Route
          path="/subaccounts/:id"
          element={
            <Layout>
              <SubAccountDetail />
            </Layout>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </NotificationProvider>
  );
}
