// useAccounts.ts
import { useState, useEffect } from 'react';
import getPocketBase from '../api/pocketbase';
import { RecordModel } from 'pocketbase';

export const useAccounts = (orgId: string | undefined) => {
  const [accounts, setAccounts] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pb = getPocketBase();

  useEffect(() => {
    if (!orgId) return;

    const abortController = new AbortController();

    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await pb.collection('accounts').getList(1, 50, {
          filter: `organization = "${orgId}"`,
          signal: abortController.signal,
          requestKey: null,
        });
        setAccounts(result.items);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Error fetching accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      abortController.abort();
    };
  }, [orgId]);

  return { accounts, loading, error };
};