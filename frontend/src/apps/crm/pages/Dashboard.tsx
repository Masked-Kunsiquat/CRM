import { HiUsers, HiChat, HiCalendar } from "react-icons/hi";
import { useDashboardStats } from "../hooks/useDashboardStats";
import BaseCard from "../../shared/components/ui/BaseCard";
import Loader from "../../shared/components/ux/Loader";
import { useToast } from "../../shared/components/ux/ToastContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { addToast } = useToast();
  const { data: stats, isLoading, error } = useDashboardStats();

  // Trigger a toast notification when an error occurs
  useEffect(() => {
    if (error) {
      addToast("Failed to load dashboard stats.", "error");
    }
  }, [error, addToast]);

  if (isLoading) return <Loader />;
  if (error) return null; 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <BaseCard title="Total Contacts" value={stats?.totalContacts || 0} icon={<HiUsers />} />
      <BaseCard title="Total Interactions" value={stats?.totalInteractions || 0} icon={<HiChat />} />
      <BaseCard title="Upcoming Events" value={stats?.upcomingEvents || 0} icon={<HiCalendar />} />
    </div>
  );
};

export default Dashboard;
