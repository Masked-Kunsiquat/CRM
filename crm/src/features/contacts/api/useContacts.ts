import { useQuery } from "@tanstack/react-query";
import getPocketBase from "../../../shared/api/pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

/**
 * The type of contact group currently active.
 * - "internal" refers to coworkers.
 * - "external" refers to clients/contacts.
 * - "all" fetches both internal and external.
 */
type ActiveTab = "internal" | "external" | "all";

/**
 * Options used to fetch contacts related to an entity.
 */
interface UseContactsOptions {
  activeTab: ActiveTab;
  entityType: "organization" | "account" | "subaccount";
  entityId: string;
  expand?: string; // Optional field expansion
}

/**
 * Fetches a list of contacts from a given collection, filtered by entity type and ID.
 * Uses `~` for multi-valued fields and `=` for single-valued ones.
 *
 * @param collection - The PocketBase collection name ("contacts" or "coworkers").
 * @param entityType - The type of linked entity ("organization", "account", or "subaccount").
 * @param entityId - The ID of the linked entity.
 * @param expand - Optional expand parameter for related fields.
 * @returns A promise resolving to an array of matching records.
 */
const fetchContacts = async (
  collection: string,
  entityType: "organization" | "account" | "subaccount",
  entityId: string,
  expand?: string,
): Promise<RecordModel[]> => {
  const multiValued = ["organization", "account"]; // These are arrays in your data
  const operator = multiValued.includes(entityType) ? "~" : "=";

  const filter = `${entityType} ${operator} "${entityId}"`;

  const result = await pb.collection(collection).getList(1, 50, {
    filter,
    expand,
  });

  return result.items;
};

/**
 * React Query hook to fetch contacts (internal, external, or both) for a specific entity.
 *
 * @param options - The options specifying active tab, entity type/id, and optional expand fields.
 * @returns Query result including data, loading, and error states.
 */
export const useContacts = ({
  activeTab,
  entityType,
  entityId,
  expand,
}: UseContactsOptions) =>
  useQuery<RecordModel[], Error>({
    queryKey: ["contacts", activeTab, entityType, entityId, expand],
    queryFn: async () => {
      if (!entityId) return [];

      if (activeTab === "internal") {
        return await fetchContacts("coworkers", entityType, entityId, expand);
      }

      if (activeTab === "external") {
        return await fetchContacts("contacts", entityType, entityId, expand);
      }

      const [internal, external] = await Promise.all([
        fetchContacts("coworkers", entityType, entityId, expand),
        fetchContacts("contacts", entityType, entityId, expand),
      ]);

      return [...internal, ...external];
    },
    enabled: !!entityId,
  });

/**
 * Utility function to fetch contacts outside of React Query.
 * Useful for server-side fetching or non-hook logic.
 *
 * @param options - The same options used in `useContacts`.
 * @returns A promise resolving to an array of contacts.
 */
export const getContactsData = async ({
  activeTab,
  entityType,
  entityId,
  expand,
}: UseContactsOptions): Promise<RecordModel[]> => {
  if (!entityId) return [];

  if (activeTab === "internal") {
    return await fetchContacts("coworkers", entityType, entityId, expand);
  }

  if (activeTab === "external") {
    return await fetchContacts("contacts", entityType, entityId, expand);
  }

  const [internal, external] = await Promise.all([
    fetchContacts("coworkers", entityType, entityId, expand),
    fetchContacts("contacts", entityType, entityId, expand),
  ]);

  return [...internal, ...external];
};
