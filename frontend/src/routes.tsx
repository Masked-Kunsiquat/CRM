import { Routes, Route } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import CRM from "./apps/crm/pages/Dashboard";
import MoodTracker from "./apps/mood-tracker";
import GasTracker from "./apps/gas-tracker";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainDashboard />} />
      <Route path="/crm" element={<CRM />} />
      <Route path="/mood-tracker" element={<MoodTracker />} />
      <Route path="/gas-tracker" element={<GasTracker />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
