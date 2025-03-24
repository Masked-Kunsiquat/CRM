"use client";

import { useState } from 'react';
import { useContacts } from '../../api/useContacts';
import OrgDetailCard from '../organizations/OrgDetailCard';
import DataTable from '../shared/DataTable';

type ContactsCardProps = {
  context: 'organization' | 'account' | 'subaccount';
  organizationId: string;
  accountId?: string;
  subaccountId?: string;
  isHomeCompany?: boolean;
};

export function ContactsCard({
  context,
  organizationId,
  accountId,
  subaccountId,
  isHomeCompany = false,
}: ContactsCardProps) {
  const [activeTab, setActiveTab] = useState<'internal' | 'external' | 'all'>('all');

  // Force internal if it's the home company
  const effectiveTab = isHomeCompany ? 'internal' : activeTab;

  const entityId =
    context === 'organization'
      ? organizationId
      : context === 'account'
      ? accountId
      : subaccountId;

  const { data: contacts = [], isLoading, error } = useContacts({
    activeTab: effectiveTab,
    entityType: context,
    entityId: entityId || '',
  });

  const contactFields = ['first_name', 'last_name', 'role'];
  const contactFieldLabels = {
    first_name: 'First Name',
    last_name: 'Last Name',
    role: 'Role',
  };

  if (isLoading) {
    return <OrgDetailCard title="Contacts">Loading...</OrgDetailCard>;
  }

  if (error) {
    return <OrgDetailCard title="Contacts">Error: {error.message}</OrgDetailCard>;
  }

  return (
    <OrgDetailCard title={isHomeCompany ? 'Coworkers' : 'Contacts'}>
      {!isHomeCompany && (
        <div className="mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'internal' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('internal')}
          >
            Internal
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${activeTab === 'external' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('external')}
          >
            External
          </button>
        </div>
      )}

      {contacts.length > 0 ? (
        <DataTable
          data={contacts}
          fields={contactFields}
          fieldLabels={contactFieldLabels}
          entityPath="/contacts"
        />
      ) : (
        <p className="text-gray-900 dark:text-white">No Contacts Found</p>
      )}
    </OrgDetailCard>
  );
}

export default ContactsCard;
