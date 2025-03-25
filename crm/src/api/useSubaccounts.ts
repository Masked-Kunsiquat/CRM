import { useQuery } from "@tanstack/react-query";
import getPocketBase from "./pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

/**
 * Fetches all subaccounts associated with the provided list of accounts.
 *
 * Each subaccount includes an `accountName` field from the expanded account.
 *
 * @param accounts - Array of account records to fetch subaccounts for.
 * @returns A flattened array of subaccount records with expanded account data.
 */
const fetchSubaccounts = async (
  accounts: RecordModel[],
): Promise<RecordModel[]> => {
  if (!accounts.length) return [];

  const allSubaccounts = await Promise.all(
    accounts.map(async (account) => {
      const subaccountsResult = await pb
        .collection("subaccounts")
        .getList(1, 50, {
          filter: `account = "${account.id}"`,
          expand: "account",
          requestKey: null,
        });

      return subaccountsResult.items.map((subaccount) => ({
        ...subaccount,
        accountName: subaccount.expand?.account?.name || "Unknown",
      }));
    }),
  );

  return allSubaccounts.flat();
};

/**
 * React Query hook to fetch subaccounts for a given array of account records.
 *
 * @param accounts - Array of account records to fetch subaccounts for.
 * @returns React Query result containing the list of subaccounts or error state.
 */
export const useSubaccounts = (accounts: RecordModel[]) => {
  return useQuery<RecordModel[], Error>({
    queryKey: ["subaccounts", accounts.map((acc) => acc.id)],
    queryFn: () => fetchSubaccounts(accounts),
    enabled: accounts.length > 0,
  });
};

/**
 * Fetches a single subaccount by its ID, expanding both the linked account and organization.
 *
 * @param subaccountId - The ID of the subaccount to fetch.
 * @returns A promise resolving to the subaccount record with expanded data.
 */
const fetchSubaccountById = async (
  subaccountId: string,
): Promise<RecordModel> => {
  return await pb.collection("subaccounts").getOne(subaccountId, {
    expand: "account.organization",
  });
};

/**
 * React Query hook to fetch a single subaccount by ID.
 * Expands the related account and its organization.
 *
 * @param subaccountId - The ID of the subaccount to fetch.
 * @returns React Query result containing the subaccount or error state.
 */
export const useSubaccount = (subaccountId?: string) =>
  useQuery<RecordModel, Error>({
    queryKey: ["subaccount", subaccountId],
    queryFn: () => {
      if (!subaccountId) throw new Error("Missing subaccount ID");
      return fetchSubaccountById(subaccountId);
    },
    enabled: !!subaccountId,
  });
