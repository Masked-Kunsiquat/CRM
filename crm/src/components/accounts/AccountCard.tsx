import { memo, useMemo } from 'react';
import { RecordModel } from 'pocketbase';
import OrgDetailCard from '../organizations/OrgDetailCard';
import DataTable from '../shared/DataTable';

interface AccountCardProps {
  accounts: RecordModel[];
}

function AccountCard({ accounts }: AccountCardProps) {
  const accountFields = ['name', 'status'];
  const accountFieldLabels = {
    name: 'Name',
    status: 'Status',
  };

  const formattedAccounts = useMemo(() => {
    return accounts.map((account) => ({
      ...account,
      status: account.status === 'active' ? '✅' : '❌',
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
