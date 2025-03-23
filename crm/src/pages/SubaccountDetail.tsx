"use client";

import { useParams } from 'react-router-dom';
import { useSubaccount } from '../api/useSubaccounts';
import ContactsCard from '../components/contacts/ContactsCard';

export default function SubAccountDetail() {
  const { id: subaccountId } = useParams();
  const { data: subaccount, isLoading, error } = useSubaccount(subaccountId);

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
