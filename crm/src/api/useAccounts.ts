import { useQuery } from '@tanstack/react-query';
import getPocketBase from '../api/pocketbase';
import { RecordModel } from 'pocketbase';

const pb = getPocketBase();

const fetchAccounts = async (orgId: string): Promise<RecordModel[]> => {
  const result = await pb.collection('accounts').getList(1, 50, {
    filter: `organization = "${orgId}"`,
  });
  return result.items;
};

export const useAccounts = (orgId?: string) => {
  return useQuery<RecordModel[], Error>({
    queryKey: ['accounts', orgId],
    queryFn: () => {
      if (!orgId) throw new Error('Invalid Organization ID');
      return fetchAccounts(orgId);
    },
    enabled: !!orgId, // only runs if orgId is truthy
  });
};
