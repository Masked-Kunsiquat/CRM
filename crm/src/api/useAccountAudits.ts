// src/api/useAccountAudits.ts
import { useQuery } from "@tanstack/react-query";
import getPocketBase from "./pocketbase";
import { RecordModel } from "pocketbase";
import { buildFloorMatrix } from "../utils/buildFloorMatrix";

const pb = getPocketBase();

export interface AuditWithFloors {
  id: string;
  date: string;
  status: "scheduled" | "pending" | "completed" | "canceled";
  note?: string;
  account: string;
  visited_floors: number[];
  score?: number;
}

export interface AccountFloorConfig {
  floors_min: number;
  floors_max: number;
  excluded_floors: number[];
}

/**
 * Fetches all audits for a specific account with their visited floors data
 * 
 * @param accountId - The ID of the account to fetch audits for
 * @returns Promise resolving to array of audit records with visited floors
 */
export const fetchAccountAudits = async (accountId: string): Promise<AuditWithFloors[]> => {
  try {
    const audits = await pb.collection("audits").getFullList({
      filter: `account = "${accountId}"`,
      sort: "date",
    });

    return audits.map((audit): AuditWithFloors => {
      // Parse visited_floors JSON field
      let visitedFloors: number[] = [];
      try {
        if (typeof audit.visited_floors === 'string') {
          visitedFloors = JSON.parse(audit.visited_floors);
        } else if (Array.isArray(audit.visited_floors)) {
          visitedFloors = audit.visited_floors;
        }
      } catch (e) {
        console.warn("Error parsing visited_floors for audit", audit.id, e);
      }

      return {
        id: audit.id,
        date: audit.date,
        status: audit.status,
        note: audit.note,
        account: audit.account,
        visited_floors: visitedFloors,
        score: audit.score,
      };
    });
  } catch (error) {
    console.error("Error fetching account audits:", error);
    throw new Error("Failed to fetch audit data with floor information");
  }
};

/**
 * Get floor configuration from account record
 * 
 * @param account - The account record
 * @returns Object containing floor configuration
 */
export const getAccountFloorConfig = (account: RecordModel): AccountFloorConfig => {
  // Ensure excluded_floors is an array
  let excludedFloors: number[] = [];
  try {
    if (typeof account.excluded_floors === 'string') {
      excludedFloors = JSON.parse(account.excluded_floors);
    } else if (Array.isArray(account.excluded_floors)) {
      excludedFloors = account.excluded_floors;
    }
  } catch (e) {
    console.warn("Could not parse excluded_floors:", e);
  }

  // Make sure floors_min and floors_max are numbers
  const floorsMin = typeof account.floors_min === 'number' ? account.floors_min : 
                    parseInt(account.floors_min, 10) || 1;
  
  const floorsMax = typeof account.floors_max === 'number' ? account.floors_max : 
                    parseInt(account.floors_max, 10) || floorsMin;

  return {
    floors_min: floorsMin,
    floors_max: floorsMax,
    excluded_floors: excludedFloors
  };
};

/**
 * Hook that fetches audits for an account and creates a floor matrix
 * 
 * @param accountId - ID of the account to fetch audits for
 * @param account - Account record with floor configuration
 * @returns Object containing audits, floor matrix, and query states
 */
export const useAccountAudits = (accountId?: string, account?: RecordModel) => {
  return useQuery({
    queryKey: ["account-audits", accountId],
    queryFn: async () => {
      if (!accountId || !account) {
        return { audits: [], floorMatrix: null };
      }
      
      const audits = await fetchAccountAudits(accountId);
      
      let floorMatrix = null;
      try {
        // Only build matrix if we have proper floor configuration
        if (account.floors_min !== undefined && account.floors_max !== undefined) {
          const floorConfig = getAccountFloorConfig(account);
          
          // Only generate matrix if we have valid floor config
          if (floorConfig.floors_min <= floorConfig.floors_max) {
            floorMatrix = buildFloorMatrix(floorConfig, audits);
          }
        }
      } catch (error) {
        console.error("Error building floor matrix:", error);
        // Let floorMatrix remain null
      }

      return { audits, floorMatrix };
    },
    enabled: !!accountId && !!account,
  });
};