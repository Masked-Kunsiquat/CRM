// useOrgDetail.ts (modified)
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getPocketBase from '../api/pocketbase';
import { RecordModel } from 'pocketbase';

export const useOrgDetail = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState<RecordModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pb = getPocketBase();

  useEffect(() => {
    // Removed: const abortController = new AbortController();

    const fetchOrganization = async () => {
      setLoading(true);
      setError(null);
      try {
        const record = await pb.collection('organizations').getOne(id as string, {
          expand: 'address',
          // Removed: signal: abortController.signal,
          requestKey: null,
        });
        setOrganization(record);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Error fetching organization:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();

    // Removed: return () => {
    // Removed:   abortController.abort();
    // Removed: };
  }, [id]);

  return { organization, loading, error };
};