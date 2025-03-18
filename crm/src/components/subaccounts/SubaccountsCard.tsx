// SubaccountsCard.tsx (corrected)
"use client";

import { useSubaccounts } from '../../api/useSubaccounts';
import OrgDetailCard from '../organizations/OrgDetailCard';
import { DataTable } from '../shared/DataTable';
import { RecordModel } from 'pocketbase';

interface SubaccountsCardProps {
  accounts: RecordModel[];
}

export function SubaccountsCard({ accounts }: SubaccountsCardProps) {
  const { subaccounts, loading, error } = useSubaccounts({ accounts });

  const subaccountFields = ['name', 'accountName', 'status'];
  const subaccountFieldLabels = {
    name: 'Name',
    accountName: 'Account Name',
    status: 'Status',
    created: 'Created',
  };

  // Corrected mapping logic:
  const formattedSubaccounts = subaccounts.map((subaccount) => ({
    ...subaccount,
    status: subaccount.status === 'active' ? '✅' : '❌', // Check for "active" string
  }));

  if (loading) return <OrgDetailCard title="Subaccounts">Loading...</OrgDetailCard>;
  if (error) return <OrgDetailCard title="Subaccounts">Error: {error}</OrgDetailCard>;

  return (
    <OrgDetailCard title="Subaccounts">
      {formattedSubaccounts.length > 0 ? (
        <DataTable data={formattedSubaccounts} fields={subaccountFields} fieldLabels={subaccountFieldLabels} />
      ) : (
        <p className="text-gray-900 dark:text-white">No Subaccounts Found</p>
      )}
    </OrgDetailCard>
  );
}

export default SubaccountsCard;