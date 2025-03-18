// useOrganizations.ts
import { useState, useEffect } from 'react';
import getPocketBase from './pocketbase';
import { RecordModel } from 'pocketbase';

export const useOrganizations = (page: number, perPage: number) => {
  const [organizations, setOrganizations] = useState<RecordModel[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pb = getPocketBase();

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await pb.collection('organizations').getList(page, perPage, {
          sort: 'name',
          expand: 'address',
          requestKey: null, // Prevent auto-cancel
        });

        const processedItems = result.items.map((item) => {
          const expandedAddress = item.expand?.address as RecordModel;
          return {
            ...item,
            city: expandedAddress?.city || 'N/A',
          };
        });

        setOrganizations(processedItems);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Error fetching organizations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [page, perPage]);

  return { organizations, totalPages, loading, error };
};

export default useOrganizations;