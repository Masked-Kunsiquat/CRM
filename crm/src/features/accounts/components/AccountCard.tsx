import { memo, useMemo } from "react";
import OrgDetailCard from "../../organizations/components/OrgDetailCard";
import DataTable from "../../../shared/components/DataTable";
import { AccountCardProps } from "../types";

/**
 * Displays a list of accounts inside an `OrgDetailCard` container.
 *
 * - Accepts an array of `RecordModel` accounts as props.
 * - Maps the account `status` field to a visual indicator:
 *   - `"active"` → ✅
 *   - otherwise → ❌
 * - Renders a `DataTable` with clickable rows linking to `/accounts/:id`.
 * - Falls back to a "No Accounts Found" message if the list is empty.
 *
 * @param {AccountCardProps} props - Component props
 * @returns {JSX.Element} A card displaying the formatted account data.
 */
function AccountCard({ accounts }: AccountCardProps) {
  const accountFields = ["name", "status"];
  const accountFieldLabels = {
    name: "Name",
    status: "Status",
  };

  const formattedAccounts = useMemo(() => {
    return accounts.map((account) => ({
      ...account,
      status: account.status === "active" ? "✅" : "❌",
    }));
  }, [accounts]);

  return (
    <OrgDetailCard title="Accounts">
      {formattedAccounts.length > 0 ? (
        <DataTable
          data={formattedAccounts}
          fields={accountFields}
          fieldLabels={accountFieldLabels}
          entityPath="accounts" // 👈 adds clickable row logic
        />
      ) : (
        <p className="text-gray-900 dark:text-white">No Accounts Found</p>
      )}
    </OrgDetailCard>
  );
}

export default memo(AccountCard);
