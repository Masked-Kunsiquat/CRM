// AccountCard.tsx (modified)
"use client";

import { RecordModel } from 'pocketbase';
import OrgDetailCard from '../organizations/OrgDetailCard';
import { DataTable } from '../shared/DataTable';

interface AccountCardProps {
  accounts: RecordModel[];
}

export function AccountCard({ accounts }: AccountCardProps) {
  const accountFields = ['name', 'status'];
  const accountFieldLabels = {
    name: 'Name',
    status: 'Status',
    created: 'Created',
  };

  // Map accounts to add a 'status' field with symbols
  const formattedAccounts = accounts.map((account) => ({
    ...account,
    status: account.status === 'active' ? '✅' : '❌', // Check for "active" string
  }));

  return (
    <OrgDetailCard title="Accounts">
      {formattedAccounts.length > 0 ? (
        <DataTable
          data={formattedAccounts}
          fields={accountFields}
          fieldLabels={accountFieldLabels}
        />
      ) : (
        <p className="text-gray-900 dark:text-white">No Accounts Found</p>
      )}
    </OrgDetailCard>
  );
}

export default AccountCard;