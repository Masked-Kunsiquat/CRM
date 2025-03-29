import { memo, useMemo } from "react";
import { useSubaccounts } from "../api/useSubaccounts";
import OrgDetailCard from "../../organizations/components/OrgDetailCard";
import DataTable from "../../../shared/components/DataTable";
import {
  SubaccountsCardProps,
  SubaccountField,
  SubaccountFieldLabels,
} from "../types";

/**
 * Displays a table of subaccounts associated with one or more accounts.
 *
 * - Fetches subaccounts via `useSubaccounts`, expanding their linked account
 * - Displays fields: name, accountName, and status (✅ / ❌)
 * - Wraps output in `OrgDetailCard` and handles loading, error, and empty states
 *
 * @param {SubaccountsCardProps} props - Props containing account records to fetch subaccounts for
 * @returns {JSX.Element} A card containing a table of subaccounts
 */
function SubaccountsCard({ accounts }: SubaccountsCardProps) {
  const { data: subaccounts, isLoading, error } = useSubaccounts(accounts);

  const subaccountFields: SubaccountField[] = ["name", "accountName", "status"];
  const subaccountFieldLabels: SubaccountFieldLabels = {
    name: "Name",
    accountName: "Account Name",
    status: "Status",
    created: "Created",
  };

  const formattedSubaccounts = useMemo(() => {
    return (
      subaccounts?.map((subaccount) => ({
        ...subaccount,
        status: subaccount.status === "active" ? "✅" : "❌",
      })) || []
    );
  }, [subaccounts]);

  if (isLoading)
    return <OrgDetailCard title="Subaccounts">Loading...</OrgDetailCard>;
  if (error)
    return (
      <OrgDetailCard title="Subaccounts">Error: {error.message}</OrgDetailCard>
    );

  return (
    <OrgDetailCard title="Subaccounts">
      {formattedSubaccounts.length > 0 ? (
        <DataTable
          data={formattedSubaccounts}
          fields={subaccountFields}
          fieldLabels={subaccountFieldLabels}
          entityPath="/subaccounts"
        />
      ) : (
        <p className="text-gray-900 dark:text-white">No Subaccounts Found</p>
      )}
    </OrgDetailCard>
  );
}

export default memo(SubaccountsCard);
