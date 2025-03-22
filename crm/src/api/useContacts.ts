import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import getPocketBase from './pocketbase';
import { RecordModel } from 'pocketbase';

const pb = getPocketBase();

type ActiveTab = 'internal' | 'external' | 'all';

const fetchContacts = async (
  organizationId: string,
  activeTab: ActiveTab
): Promise<RecordModel[]> => {
  let filter = `organization = "${organizationId}"`;

  if (activeTab === 'internal') {
    filter += ` && type = "internal"`;
  } else if (activeTab === 'external') {
    filter += ` && type = "external"`;
  }

  const result = await pb.collection('contacts').getList(1, 50, { filter });
  return result.items;
};

export const useContacts = (activeTab: ActiveTab) => {
  const { id: organizationId } = useParams();

  return useQuery<RecordModel[], Error>({
    queryKey: ['contacts', organizationId, activeTab],
    queryFn: () => {
      if (!organizationId) throw new Error('Organization ID is required');
      return fetchContacts(organizationId, activeTab);
    },
    enabled: !!organizationId, // query only if organizationId exists
  });
};
