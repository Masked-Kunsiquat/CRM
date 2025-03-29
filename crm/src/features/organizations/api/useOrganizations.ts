import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getPocketBase from "../../../shared/api/pocketbase";
import { RecordModel } from "pocketbase";
import {
  Organization,
  CreateOrganizationData,
  UpdateOrganizationData,
  OrganizationListResponse,
} from "../types";

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
const fetchOrganizations = async (
  page: number,
  perPage: number,
): Promise<OrganizationListResponse> => {
  const result = await pb.collection("organizations").getList(page, perPage, {
    sort: "name",
    expand: "address",
  });

  const processedItems: Organization[] = result.items.map((item) => {
    const expandedAddress = item.expand?.address as RecordModel;
    return {
      ...item,
      city: expandedAddress?.city || "N/A",
    } as Organization;
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

/**
 * Creates a new organization in PocketBase.
 * This function handles the creation of related address record if needed.
 *
 * @param data - The organization data to create
 * @returns The created organization record
 */
const createOrganization = async (
  data: CreateOrganizationData,
): Promise<Organization> => {
  // Process the address string to create an address record
  let addressId = "";
  if (data.address) {
    const [street, city, state, zip_code] = data.address
      .split(",")
      .map((part) => part.trim());

    const addressRecord = await pb.collection("address").create({
      street,
      city,
      state,
      zip_code,
      type: "site",
    });

    addressId = addressRecord.id;
  }

  // Create the organization
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  formData.append("active", data.active?.toString() || "true");
  formData.append(
    "is_home_company",
    data.is_home_company?.toString() || "false",
  );
  if (addressId) formData.append("address", addressId);
  if (data.logo) formData.append("logo", data.logo);

  return (await pb
    .collection("organizations")
    .create(formData)) as Organization;
};

/**
 * Updates an existing organization in PocketBase.
 * This function handles updating or creating related address record if needed.
 *
 * @param id - The ID of the organization to update
 * @param data - The organization data to update
 * @returns The updated organization record
 */
const updateOrganization = async (
  id: string,
  data: UpdateOrganizationData,
): Promise<Organization> => {
  // Get the current organization to access its address
  const organization: Organization = await pb
    .collection("organizations")
    .getOne(id, { expand: "address" });

  // Process the address if provided
  if (data.address) {
    const [street, city, state, zip_code] = data.address
      .split(",")
      .map((part) => part.trim());

    const addressData = {
      street,
      city,
      state,
      zip_code,
      type: "site",
    };

    // Update or create the address
    let addressId = "";
    if (organization.address) {
      await pb.collection("address").update(organization.address, addressData);
      addressId = organization.address;
    } else {
      const addressRecord = await pb.collection("address").create(addressData);
      addressId = addressRecord.id;
    }

    // Ensure the address ID is included in the organization update
    data.address = addressId;
  }

  // Update the organization
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.active !== undefined)
    formData.append("active", data.active.toString());
  if (data.is_home_company !== undefined)
    formData.append("is_home_company", data.is_home_company.toString());
  if (data.address) formData.append("address", data.address);
  if (data.logo) formData.append("logo", data.logo);

  return (await pb
    .collection("organizations")
    .update(id, formData)) as Organization;
};

/**
 * Deletes an organization from PocketBase.
 *
 * @param id - The ID of the organization to delete
 * @returns void
 */
const deleteOrganization = async (id: string): Promise<void> => {
  // Get the organization to check if it has an address to delete
  const organization: Organization = await pb
    .collection("organizations")
    .getOne(id);

  // Delete the organization
  await pb.collection("organizations").delete(id);

  // If the organization has an address, delete it as well
  // Note: This depends on your business logic - you might want to keep addresses
  if (organization.address) {
    try {
      await pb.collection("address").delete(organization.address);
    } catch (error) {
      console.error("Failed to delete address:", error);
      // We might not want to fail the whole operation if address deletion fails
      // e.g. if the address is used by other records
    }
  }
};

/**
 * React Query hook for creating a new organization.
 * Automatically invalidates the organizations list query on success.
 *
 * @returns React Query mutation result for creating an organization
 */
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationData) => createOrganization(data),
    onSuccess: () => {
      // Invalidate organizations queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

/**
 * React Query hook for updating an existing organization.
 * Automatically invalidates the related organization queries on success.
 *
 * @param id - The ID of the organization to update
 * @returns React Query mutation result for updating an organization
 */
export const useUpdateOrganization = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationData) => updateOrganization(id, data),
    onSuccess: () => {
      // Invalidate specific organization and the list
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

/**
 * React Query hook for deleting an organization.
 * Automatically invalidates the organizations list query on success.
 *
 * @returns React Query mutation result for deleting an organization
 */
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: () => {
      // Invalidate organizations queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

export default useOrganizations;
