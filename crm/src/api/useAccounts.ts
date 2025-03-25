// crm/src/api/useAccounts.ts
import { useQuery } from "@tanstack/react-query";
import getPocketBase from "../api/pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

/**
 * Fetches all accounts linked to a specific organization.
 *
 * @param {string} orgId - The ID of the organization.
 * @returns {Promise<RecordModel[]>} A promise that resolves to an array of account records.
 */
const fetchAccounts = async (orgId: string): Promise<RecordModel[]> => {
  const result = await pb.collection("accounts").getList(1, 50, {
    filter: `organization = "${orgId}"`,
  });
  return result.items;
};

/**
 * React Query hook to fetch all accounts for a given organization.
 * Automatically handles loading, caching, and error states.
 *
 * @param {string} [orgId] - The ID of the organization.
 * @returns React Query result object containing accounts or error state.
 */
export const useAccounts = (orgId?: string) =>
  useQuery<RecordModel[], Error>({
    queryKey: ["accounts", orgId],
    queryFn: () => {
      if (!orgId) throw new Error("Invalid Organization ID");
      return fetchAccounts(orgId);
    },
    enabled: !!orgId,
  });

/**
 * Fetches a single account by its ID, expanding the linked organization and address.
 *
 * @param {string} accountId - The ID of the account to fetch.
 * @returns {Promise<RecordModel>} A promise that resolves to a single account record.
 */
const fetchAccountById = async (accountId: string): Promise<RecordModel> => {
  return await pb.collection("accounts").getOne(accountId, {
    expand: "organization,address",
  });
};

/**
 * React Query hook to fetch a single account by ID with expanded data.
 * Expands the linked organization and address fields.
 *
 * @param {string} [accountId] - The ID of the account to fetch.
 * @returns React Query result object containing the account or error state.
 */
export const useAccount = (accountId?: string) =>
  useQuery<RecordModel, Error>({
    queryKey: ["account", accountId],
    queryFn: () => {
      if (!accountId) throw new Error("Missing account ID");
      return fetchAccountById(accountId);
    },
    enabled: !!accountId,
  });
