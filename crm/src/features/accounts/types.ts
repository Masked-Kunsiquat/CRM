import { RecordModel } from "pocketbase";

/**
 * Props for the AccountCard component
 */
export interface AccountCardProps {
  accounts: RecordModel[];
}

/**
 * Represents the status of an audit
 * Note: This is imported from "../../audits/api/useAuditStatus" in the original code
 */
export type AuditStatus = {
  status: "pending" | "scheduled" | "completed" | "missed" | "canceled";
  expectedDate: Date;
  actualDate?: Date;
};

// The following types are referenced but not explicitly defined in the provided code
// They are included here as placeholders and should be properly defined based on their actual structure

/**
 * Field labels mapping for DataTable component
 */
export interface FieldLabels {
  [key: string]: string;
}

/**
 * Table data for the DataTable component
 */
export type TableData = Record<string, any>[];
