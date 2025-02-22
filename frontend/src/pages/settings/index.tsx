import { Route, Routes } from "react-router-dom";
import MainSettings from "./MainSettings";
import CRMSettings from "./CRMSettings";
import MoodTrackerSettings from "./MoodTrackerSettings";
import GasTrackerSettings from "./GasTrackerSettings";

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainSettings />} />
      <Route path="/crm" element={<CRMSettings />} />
      <Route path="/mood-tracker" element={<MoodTrackerSettings />} />
      <Route path="/gas-tracker" element={<GasTrackerSettings />} />
    </Routes>
  );
};

export default SettingsRoutes;
