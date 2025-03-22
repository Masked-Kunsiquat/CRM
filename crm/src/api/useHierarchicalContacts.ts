// crm/src/api/useHierarchicalContacts.ts
import { useQuery } from '@tanstack/react-query';
import getPocketBase from './pocketbase';
import { getContactsData } from './useContacts';
import { RecordModel } from 'pocketbase';

const pb = getPocketBase();

interface UseHierarchicalContactsOptions {
  context: 'organization' | 'account' | 'subaccount';
  organizationId: string;
  accountId?: string;
  subaccountId?: string;
  activeTab: 'internal' | 'external' | 'all';
}

export const useHierarchicalContacts = ({
  context,
  organizationId,
  accountId,
  subaccountId,
  activeTab,
}: UseHierarchicalContactsOptions) => {
  return useQuery<RecordModel[], Error>({
    queryKey: ['hierarchicalContacts', context, organizationId, accountId, subaccountId, activeTab],
    queryFn: async () => {
      const org = await pb.collection('organizations').getOne(organizationId);
      const isHomeCompany = org?.is_home_company;

      if (context === 'organization' && activeTab === 'internal' && isHomeCompany) {
        return await pb.collection('coworkers').getFullList({ sort: '-updated' });
      }

      return await getContactsData({
        activeTab,
        entityType: context,
        entityId:
          context === 'organization'
            ? organizationId
            : context === 'account'
            ? accountId!
            : subaccountId!,
        fallbackEntityId:
          context === 'subaccount'
            ? accountId
            : context === 'account'
            ? organizationId
            : undefined,
      });
    },
    enabled: !!organizationId,
  });
};