import { HiUserGroup, HiEmojiHappy, HiOutlineTruck } from "react-icons/hi";
import BaseCard from "../apps/shared/components/ui/BaseCard";

const MainDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-6 dark:bg-gray-800 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <BaseCard 
          title="CRM" 
          description="Manage your contacts" 
          icon={<HiUserGroup />} 
          to="/crm" 
        />
        <BaseCard 
          title="Mood Tracker" 
          description="Log your daily mood" 
          icon={<HiEmojiHappy />} 
          to="/mood-tracker" 
        />
        <BaseCard 
          title="Gas Tracker" 
          description="Track your mileage" 
          icon={<HiOutlineTruck />} 
          to="/gas-tracker" 
        />
      </div>
    </div>
  );
};

export default MainDashboard;
