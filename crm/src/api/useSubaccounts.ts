// useSubaccounts.ts (modified)
import { useState, useEffect } from 'react';
import getPocketBase from './pocketbase';
import { RecordModel } from 'pocketbase';

interface UseSubaccountsProps {
  accounts: RecordModel[];
}

export const useSubaccounts = ({ accounts }: UseSubaccountsProps) => {
  const [subaccounts, setSubaccounts] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pb = getPocketBase();

  useEffect(() => {
    // Removed: const abortController = new AbortController();

    const fetchSubaccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (accounts.length > 0) {
          const allSubaccounts = await Promise.all(
            accounts.map(async (account) => {
              const subaccountsResult = await pb.collection('subaccounts').getList(1, 50, {
                filter: `account = "${account.id}"`,
                expand: 'account',
                // Removed: signal: abortController.signal,
                requestKey: null,
              });
              return subaccountsResult.items.map((subaccount) => ({
                ...subaccount,
                accountName: subaccount.expand?.account?.name || 'Unknown',
              }));
            })
          );

          const flattenedSubaccounts = allSubaccounts.flat();
          setSubaccounts(flattenedSubaccounts);
        } else {
          setSubaccounts([]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Error fetching subaccounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubaccounts();

    // Removed: return () => {
    // Removed:   abortController.abort();
    // Removed: };
  }, [accounts]);

  return { subaccounts, loading, error };
};