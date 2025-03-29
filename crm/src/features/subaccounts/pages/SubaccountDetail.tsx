"use client";

/**
 * Subaccount detail page.
 *
 * - Fetches a subaccount by ID using `useSubaccount`
 * - Displays subaccount name and renders related contacts
 * - Contacts are linked via `organizationId`, `accountId`, and `subaccountId`
 * - Handles loading and error states
 */

import { useParams } from "react-router-dom";
import { useSubaccount } from "../api/useSubaccounts";
import ContactsCard from "../../contacts/components/ContactsCard";

export default function SubAccountDetail() {
  const { id: subaccountId } = useParams();
  const { data: subaccount, isLoading, error } = useSubaccount(subaccountId);

  const expandedAccount = subaccount?.expand?.account;
  const expandedOrg = expandedAccount?.expand?.organization;

  if (isLoading) return <div>Loading subaccount...</div>;
  if (error || !subaccount)
    return <div>Error: {error?.message || "Subaccount not found"}</div>;

  return (
    <div className="h-screen p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-4 text-2xl font-bold">Subaccount: {subaccount.name}</h1>
      <ContactsCard
        context="subaccount"
        organizationId={expandedOrg?.id || ""}
        accountId={expandedAccount?.id || ""}
        subaccountId={subaccount.id}
      />
    </div>
  );
}
