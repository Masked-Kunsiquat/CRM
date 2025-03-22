// src/pages/AccountDetail.tsx
"use client";

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getPocketBase from '../api/pocketbase';
import ContactsCard from '../components/contacts/ContactsCard';

const pb = getPocketBase();

export default function AccountDetail() {
  const { id: accountId } = useParams();

  const { data: account, isLoading, error } = useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => {
      if (!accountId) throw new Error("Missing account ID");
      return await pb.collection('accounts').getOne(accountId, { expand: 'organization' });
    },
    enabled: !!accountId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !account) return <div>Error: {error?.message || "Account not found"}</div>;

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Account: {account.name}</h1>
      <ContactsCard
        context="account"
        organizationId={account.expand?.organization?.id || ''}
        accountId={account.id}
      />
    </div>
  );
}
