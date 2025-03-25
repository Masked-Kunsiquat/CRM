import { useQuery } from "@tanstack/react-query";
import getPocketBase from "./pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

type ActiveTab = "internal" | "external" | "all";

interface UseContactsOptions {
  activeTab: ActiveTab;
  entityType: "organization" | "account" | "subaccount";
  entityId: string;
  expand?: string; // optional expand
}

const fetchContacts = async (
  collection: string,
  entityType: "organization" | "account" | "subaccount",
  entityId: string,
  expand?: string,
): Promise<RecordModel[]> => {
  // Use ~ for multi-rel fields
  const multiValued = ["organization", "account"]; // These are arrays in your data
  const operator = multiValued.includes(entityType) ? "~" : "=";

  const filter = `${entityType} ${operator} "${entityId}"`;

  const result = await pb.collection(collection).getList(1, 50, {
    filter,
    expand,
  });

  return result.items;
};

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
