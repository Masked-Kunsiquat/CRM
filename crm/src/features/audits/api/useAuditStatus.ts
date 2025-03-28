import { useQuery } from "@tanstack/react-query";
import { useAccount } from "../../accounts/api/useAccounts";
import getPocketBase from "../../../shared/api/pocketbase";
import { Frequency, Audit, AuditStatus } from "../types";

const pb = getPocketBase();

const fetchAudits = async (accountId: string): Promise<Audit[]> => {
  const audits = await pb.collection("audits").getFullList({
    filter: `account = "${accountId}"`,
    sort: "-date",
  });

  return audits.map((audit: any) => ({
    account_id: audit.account,
    date: audit.date,
    status: audit.status,
  }));
};

// This function now gets the last completed audit date, or falls back to the most recent audit of any status
function getLastAuditDate(audits: Audit[]): Date | null {
  // First try to get the most recent completed audit
  const completed = audits.filter((a) => a.status === "completed");
  if (completed.length > 0) {
    return new Date(
      Math.max(...completed.map((audit) => new Date(audit.date).getTime())),
    );
  }

  // If no completed audits, fall back to the most recent audit of any status
  if (audits.length === 0) return null;

  return new Date(
    Math.max(...audits.map((audit) => new Date(audit.date).getTime())),
  );
}

function generateExpectedDates(
  startDate: Date,
  frequency: Frequency,
  endDate: Date,
): Date[] {
  const dates: Date[] = [];
  let current = new Date(startDate);
  current.setDate(1);

  if (current > endDate) return [];

  while (current <= endDate) {
    dates.push(new Date(current)); // clone

    switch (frequency) {
      case "monthly":
        current.setMonth(current.getMonth() + 1);
        break;
      case "bi-monthly":
        current.setMonth(current.getMonth() + 2);
        break;
      case "quarterly":
        current.setMonth(current.getMonth() + 3);
        break;
      case "triennially":
        current.setFullYear(current.getFullYear() + 3);
        break;
    }
  }

  return dates;
}

function getAuditStatus(expectedDates: Date[], audits: Audit[]): AuditStatus[] {
  return expectedDates.map((expectedDate) => {
    const match = audits.find((audit) => {
      const auditDate = new Date(audit.date);
      return (
        auditDate.getUTCFullYear() === expectedDate.getUTCFullYear() &&
        auditDate.getUTCMonth() === expectedDate.getUTCMonth()
      );
    });

    if (!match) {
      return {
        expectedDate,
        status: "missed",
      };
    }

    return {
      expectedDate,
      status: match.status as AuditStatus["status"], // includes completed/pending/etc.
      actualDate: new Date(match.date),
    };
  });
}

export const useAuditStatus = (
  accountId?: string,
): {
  auditStatus: AuditStatus[];
  isLoading: boolean;
  isError: boolean;
} => {
  const {
    data: account,
    isLoading: accountLoading,
    isError: accountError,
  } = useAccount(accountId);

  const queryResult = useQuery<AuditStatus[]>({
    queryKey: ["auditStatus", accountId],
    queryFn: async () => {
      if (!accountId || !account) throw new Error("Invalid account or ID");
      const audits = await fetchAudits(accountId);

      if (audits.length === 0) return [];

      // Use the new function instead of getLastCompletedAuditDate
      const startDate = getLastAuditDate(audits) || new Date();
      const expected = generateExpectedDates(
        startDate,
        account.frequency,
        new Date(),
      );

      return getAuditStatus(expected, audits);
    },
    enabled: !!accountId && !!account,
  });

  return {
    auditStatus: queryResult.data ?? [],
    isLoading: accountLoading || queryResult.isLoading,
    isError: accountError || queryResult.isError,
  };
};

export type { AuditStatus };
