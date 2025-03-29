import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import getPocketBase from "../../../shared/api/pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

/**
 * Fetches a single organization by its ID, expanding the related address field.
 *
 * @param id - The ID of the organization to fetch.
 * @returns A promise resolving to the organization's record.
 */
const fetchOrganization = async (id: string): Promise<RecordModel> => {
  return pb.collection("organizations").getOne(id, { expand: "address" });
};

/**
 * React Query hook for fetching a single organization's detail using the route param `id`.
 * Automatically expands the linked address field.
 *
 * @returns React Query result containing the organization record or error state.
 */
export const useOrgDetail = () => {
  const { id } = useParams();

  return useQuery<RecordModel, Error>({
    queryKey: ["organization", id],
    queryFn: () => {
      if (!id) throw new Error("Invalid Organization ID");
      return fetchOrganization(id);
    },
    enabled: !!id, // only run query if id is present
  });
};
