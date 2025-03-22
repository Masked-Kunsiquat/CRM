import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import getPocketBase from '../api/pocketbase';
import { RecordModel } from 'pocketbase';

const pb = getPocketBase();

const fetchOrganization = async (id: string): Promise<RecordModel> => {
  return pb.collection('organizations').getOne(id, { expand: 'address' });
};

export const useOrgDetail = () => {
  const { id } = useParams();

  return useQuery<RecordModel, Error>({
    queryKey: ['organization', id],
    queryFn: () => {
      if (!id) throw new Error('Invalid Organization ID');
      return fetchOrganization(id);
    },
    enabled: !!id, // only run query if id is present
  });
};
