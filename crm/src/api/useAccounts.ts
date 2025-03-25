import { useQuery } from "@tanstack/react-query";
import getPocketBase from "../api/pocketbase";
import { RecordModel } from "pocketbase";

const pb = getPocketBase();

// Fetch all accounts for a given organization
const fetchAccounts = async (orgId: string): Promise<RecordModel[]> => {
  const result = await pb.collection("accounts").getList(1, 50, {
    filter: `organization = "${orgId}"`,
  });
  return result.items;
};

export const useAccounts = (orgId?: string) =>
  useQuery<RecordModel[], Error>({
    queryKey: ["accounts", orgId],
    queryFn: () => {
      if (!orgId) throw new Error("Invalid Organization ID");
      return fetchAccounts(orgId);
    },
    enabled: !!orgId,
  });

// 🔹 New: Fetch a single account with expanded org + address
const fetchAccountById = async (accountId: string): Promise<RecordModel> => {
  return await pb.collection("accounts").getOne(accountId, {
    expand: "organization,address",
  });
};

export const useAccount = (accountId?: string) =>
  useQuery<RecordModel, Error>({
    queryKey: ["account", accountId],
    queryFn: () => {
      if (!accountId) throw new Error("Missing account ID");
      return fetchAccountById(accountId);
    },
    enabled: !!accountId,
  });
