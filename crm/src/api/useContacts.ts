// useContacts.ts (modified)
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getPocketBase from './pocketbase';
import { RecordModel } from 'pocketbase';

export const useContacts = (activeTab: 'internal' | 'external' | 'all') => {
  const [contacts, setContacts] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: organizationId } = useParams();
  const pb = getPocketBase();

  useEffect(() => {
    if (!organizationId) return;

    // Removed: const abortController = new AbortController();

    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        let filter = `organization = "${organizationId}"`;

        if (activeTab === 'internal') {
          filter += ` && type = "internal"`;
        } else if (activeTab === 'external') {
          filter += ` && type = "external"`;
        }

        const result = await pb.collection('contacts').getList(1, 50, {
          filter: filter,
          // Removed: signal: abortController.signal,
          requestKey: null,
        });
        setContacts(result.items);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();

    // Removed: return () => {
    // Removed:   abortController.abort();
    // Removed: };
  }, [organizationId, activeTab]);

  return { contacts, loading, error };
};