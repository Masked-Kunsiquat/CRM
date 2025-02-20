
import { useQuery } from "react-query";
import pb from "../../../lib/pocketbase";

const fetchStats = async () => {
  const totalContacts = await pb.collection("crm_people").getList(1, 1);
  const totalInteractions = await pb.collection("crm_interactions").getList(1, 1);
  const upcomingEvents = await pb.collection("crm_events").getList(1, 1, {
    filter: `date >= "${new Date().toISOString()}"`,
  });

  return {
    totalContacts: totalContacts.totalItems,
    totalInteractions: totalInteractions.totalItems,
    upcomingEvents: upcomingEvents.totalItems,
  };
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchStats,
  });
};
