import { useQuery } from "@tanstack/react-query";
import getPocketBase from "./pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

/**
 * Fetches a paginated list of organizations from PocketBase,
 * sorted by name and expanded to include their address.
 *
 * Adds a `city` property to each organization based on the expanded address.
 *
 * @param page - The current page number.
 * @param perPage - The number of organizations per page.
 * @returns A promise resolving to an object containing:
 *  - `organizations`: Array of processed organization records.
 *  - `totalPages`: Total number of pages available.
 */
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

/**
 * React Query hook to fetch paginated organizations.
 * Automatically handles caching, loading, and errors.
 *
 * @param page - The current page number.
 * @param perPage - The number of organizations per page.
 * @returns React Query result with the organization data.
 */
export const useOrganizations = (page: number, perPage: number) => {
  return useQuery({
    queryKey: ["organizations", page, perPage],
    queryFn: () => fetchOrganizations(page, perPage),
  });
};

export default useOrganizations;
