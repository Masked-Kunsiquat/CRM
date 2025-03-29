import { RecordModel } from "pocketbase";

/**
 * Props for the SubaccountsCard component
 */
export interface SubaccountsCardProps {
  accounts: RecordModel[];
}

/**
 * Supported field names for subaccount display
 */
export type SubaccountField = "name" | "accountName" | "status" | "created";

/**
 * Field labels mapping for Subaccounts data table
 * Includes an index signature to allow any string key
 */
export interface SubaccountFieldLabels {
  name: string;
  accountName: string;
  status: string;
  created: string;
  [key: string]: string; // Add index signature for compatibility with DataTable
}

/**
 * Subaccount data structure after formatting
 */
export interface FormattedSubaccount extends RecordModel {
  status: string; // Will be "✅" or "❌"
  accountName?: string;
}
