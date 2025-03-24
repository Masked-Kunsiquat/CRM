import { useQuery } from '@tanstack/react-query';
import getPocketBase from './pocketbase';
import { RecordModel } from 'pocketbase';

const pb = getPocketBase();

// 🔹 Fetch all subaccounts for given accounts
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
    queryKey: ['subaccounts', accounts.map((acc) => acc.id)],
    queryFn: () => fetchSubaccounts(accounts),
    enabled: accounts.length > 0,
  });
};

// 🔹 Fetch single subaccount with expanded account + organization
const fetchSubaccountById = async (subaccountId: string): Promise<RecordModel> => {
  return await pb.collection('subaccounts').getOne(subaccountId, {
    expand: 'account.organization',
  });
};

export const useSubaccount = (subaccountId?: string) =>
  useQuery<RecordModel, Error>({
    queryKey: ['subaccount', subaccountId],
    queryFn: () => {
      if (!subaccountId) throw new Error('Missing subaccount ID');
      return fetchSubaccountById(subaccountId);
    },
    enabled: !!subaccountId,
  });
