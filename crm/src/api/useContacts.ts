// crm/src/api/useContacts.ts
import { useQuery } from '@tanstack/react-query';
import getPocketBase from './pocketbase';
import { RecordModel } from 'pocketbase';

const pb = getPocketBase();

type ActiveTab = 'internal' | 'external' | 'all';

interface UseContactsOptions {
  activeTab: ActiveTab;
  entityType: 'organization' | 'account' | 'subaccount';
  entityId: string;
  fallbackEntityId?: string;
}

const buildFilter = (
  type: 'organization' | 'account' | 'subaccount',
  id: string
) => `${type} ~ "${id}"`;

export const useContacts = ({
  activeTab,
  entityType,
  entityId,
  fallbackEntityId,
}: UseContactsOptions) =>
  useQuery<RecordModel[], Error>({
    queryKey: ['contacts', activeTab, entityType, entityId],
    queryFn: async () => {
      const fetchFrom = async (collection: string, id: string) => {
        const filter = buildFilter(entityType, id);
        const result = await pb.collection(collection).getList(1, 50, { filter });
        return result.items;
      };

      if (!entityId) return [];

      let data: RecordModel[] = [];

      if (activeTab === 'internal') {
        data = await fetchFrom('coworkers', entityId);
        if (data.length === 0 && fallbackEntityId) {
          data = await fetchFrom('coworkers', fallbackEntityId);
        }
      } else if (activeTab === 'external') {
        data = await fetchFrom('contacts', entityId);
        if (data.length === 0 && fallbackEntityId) {
          data = await fetchFrom('contacts', fallbackEntityId);
        }
      } else {
        // All: fetch both and merge
        const [internal, external] = await Promise.all([
          fetchFrom('coworkers', entityId),
          fetchFrom('contacts', entityId),
        ]);
        data = [...internal, ...external];
      }

      return data;
    },
    enabled: !!entityId,
  });

  export const getContactsData = async ({
    activeTab,
    entityType,
    entityId,
    fallbackEntityId,
  }: UseContactsOptions): Promise<RecordModel[]> => {
    const fetchFrom = async (collection: string, id: string) => {
      const filter = buildFilter(entityType, id);
      const result = await pb.collection(collection).getList(1, 50, { filter });
      return result.items;
    };
  
    if (!entityId) return [];
  
    let data: RecordModel[] = [];
  
    if (activeTab === 'internal') {
      data = await fetchFrom('coworkers', entityId);
      if (data.length === 0 && fallbackEntityId) {
        data = await fetchFrom('coworkers', fallbackEntityId);
      }
    } else if (activeTab === 'external') {
      data = await fetchFrom('contacts', entityId);
      if (data.length === 0 && fallbackEntityId) {
        data = await fetchFrom('contacts', fallbackEntityId);
      }
    } else {
      const [internal, external] = await Promise.all([
        fetchFrom('coworkers', entityId),
        fetchFrom('contacts', entityId),
      ]);
      data = [...internal, ...external];
    }
  
    return data;
  };
  