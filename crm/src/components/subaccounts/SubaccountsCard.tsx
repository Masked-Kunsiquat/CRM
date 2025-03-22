import { memo, useMemo } from 'react';
import { useSubaccounts } from '../../api/useSubaccounts';
import OrgDetailCard from '../organizations/OrgDetailCard';
import DataTable from '../shared/DataTable';
import { RecordModel } from 'pocketbase';

interface SubaccountsCardProps {
  accounts: RecordModel[];
}

function SubaccountsCard({ accounts }: SubaccountsCardProps) {
  const { data: subaccounts, isLoading, error } = useSubaccounts(accounts);

  const subaccountFields = ['name', 'accountName', 'status'];
  const subaccountFieldLabels = {
    name: 'Name',
    accountName: 'Account Name',
    status: 'Status',
    created: 'Created',
  };

  const formattedSubaccounts = useMemo(() => {
    return (
      subaccounts?.map((subaccount) => ({
        ...subaccount,
        status: subaccount.status === 'active' ? '✅' : '❌',
      })) || []
    );
  }, [subaccounts]);

  if (isLoading)
    return <OrgDetailCard title="Subaccounts">Loading...</OrgDetailCard>;
  if (error)
    return <OrgDetailCard title="Subaccounts">Error: {error.message}</OrgDetailCard>;

  return (
    <OrgDetailCard title="Subaccounts">
      {formattedSubaccounts.length > 0 ? (
        <DataTable
          data={formattedSubaccounts}
          fields={subaccountFields}
          fieldLabels={subaccountFieldLabels}
          entityPath="/subaccounts" // added here
        />
      ) : (
        <p className="text-gray-900 dark:text-white">No Subaccounts Found</p>
      )}
    </OrgDetailCard>
  );
}

export default memo(SubaccountsCard);
