"use client";

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getPocketBase from '../api/pocketbase';
import ContactsCard from '../components/contacts/ContactsCard';

const pb = getPocketBase();

export default function SubAccountDetail() {
  const { id: subaccountId } = useParams();

  const { data: subaccount, isLoading, error } = useQuery({
    queryKey: ['subaccount', subaccountId],
    queryFn: async () => {
      if (!subaccountId) throw new Error("Missing subaccount ID");
      return await pb.collection('subaccounts').getOne(subaccountId, {
        expand: 'account.organization',
      });
    },
    enabled: !!subaccountId,
  });

  const expandedAccount = subaccount?.expand?.account;
  const expandedOrg = expandedAccount?.expand?.organization;

  if (isLoading) return <div>Loading subaccount...</div>;
  if (error || !subaccount) return <div>Error: {error?.message || "Subaccount not found"}</div>;

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Subaccount: {subaccount.name}</h1>
      <ContactsCard
        context="subaccount"
        organizationId={expandedOrg?.id || ''}
        accountId={expandedAccount?.id || ''}
        subaccountId={subaccount.id}
      />
    </div>
  );
}
