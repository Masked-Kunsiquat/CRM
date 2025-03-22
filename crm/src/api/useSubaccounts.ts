import { useQuery } from '@tanstack/react-query';
import getPocketBase from './pocketbase';
import { RecordModel } from 'pocketbase';

const pb = getPocketBase();

const fetchSubaccounts = async (accounts: RecordModel[]): Promise<RecordModel[]> => {
  if (!accounts.length) return [];

  const allSubaccounts = await Promise.all(
    accounts.map(async (account) => {
      const subaccountsResult = await pb.collection('subaccounts').getList(1, 50, {
        filter: `account = "${account.id}"`,
        expand: 'account',
        requestKey: null,
      });

      return subaccountsResult.items.map((subaccount) => ({
        ...subaccount,
        accountName: subaccount.expand?.account?.name || 'Unknown',
      }));
    })
  );

  return allSubaccounts.flat();
};

export const useSubaccounts = (accounts: RecordModel[]) => {
  return useQuery<RecordModel[], Error>({
    queryKey: ['subaccounts', accounts.map(acc => acc.id)], // ensures re-fetch if accounts change
    queryFn: () => fetchSubaccounts(accounts),
    enabled: accounts.length > 0, // Only runs if accounts exist
  });
};
