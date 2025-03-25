import { useQuery } from "@tanstack/react-query";
import getPocketBase from "./pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

const fetchOrganizations = async (page: number, perPage: number) => {
  const result = await pb.collection("organizations").getList(page, perPage, {
    sort: "name",
    expand: "address",
  });

  const processedItems = result.items.map((item) => {
    const expandedAddress = item.expand?.address as RecordModel;
    return {
      ...item,
      city: expandedAddress?.city || "N/A",
    };
  });

  return {
    organizations: processedItems,
    totalPages: result.totalPages,
  };
};

export const useOrganizations = (page: number, perPage: number) => {
  return useQuery({
    queryKey: ["organizations", page, perPage],
    queryFn: () => fetchOrganizations(page, perPage),
  });
};

export default useOrganizations;
