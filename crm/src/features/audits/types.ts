/**
 * Audit frequency options
 */
export type Frequency = "monthly" | "bi-monthly" | "quarterly" | "triennially";

/**
 * Basic audit information
 */
export interface Audit {
  account_id: string;
  date: string;
  status: "completed" | "scheduled" | "pending" | "canceled";
}

/**
 * Audit status with expected and actual dates
 */
export interface AuditStatus {
  expectedDate: Date;
  status: "completed" | "missed" | "pending" | "scheduled" | "canceled";
  actualDate?: Date;
}

/**
 * Extended audit information with visited floors
 */
export interface AuditWithFloors {
  id: string;
  date: string;
  status: "scheduled" | "pending" | "completed" | "canceled";
  note?: string;
  account: string;
  visited_floors: number[];
  score?: number;
}

/**
 * Account floor configuration
 */
export interface AccountFloorConfig {
  floors_min: number;
  floors_max: number;
  excluded_floors: number[];
}
