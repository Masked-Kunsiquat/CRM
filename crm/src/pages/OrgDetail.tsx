"use client";

import { useNavigate } from 'react-router-dom';
import { useOrgDetail } from '../api/useOrgDetail';
import { useAccounts } from '../api/useAccounts';
import OrgDetailCard from '../components/organizations/OrgDetailCard';
import ContactsCard from '../components/contacts/ContactsCard';
import AccountCard from '../components/accounts/AccountCard';
import SubaccountsCard from '../components/subaccounts/SubaccountsCard';
import { RecordModel } from 'pocketbase';

function OrgDetail() {
  const navigate = useNavigate();
  
  const {
    data: organization,
    isLoading: orgLoading,
    error: orgError,
  } = useOrgDetail();

  const {
    data: accounts,
    isLoading: accLoading,
    error: accError,
  } = useAccounts(organization?.id);

  if (orgLoading || accLoading) return <div>Loading organization details...</div>;
  if (orgError || accError) return <div>Error: {orgError?.message || accError?.message}</div>;
  if (!organization) return <div>Organization not found.</div>;

  const expandedAddress = organization.expand?.address as RecordModel;

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back
      </button>
      <h1 className="text-3xl font-semibold mb-4 dark:text-gray-100">{organization.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrgDetailCard title="Organization Details">
          <p>ID: {organization.id}</p>
          <p>Active: {organization.active ? 'Yes' : 'No'}</p>
          <p>Created: {organization.created}</p>
          <p>Updated: {organization.updated}</p>
        </OrgDetailCard>
        <OrgDetailCard title="Address">
          <p>Street: {expandedAddress?.street || 'N/A'}</p>
          <p>City: {expandedAddress?.city || 'N/A'}</p>
          <p>State: {expandedAddress?.state || 'N/A'}</p>
          <p>Zip: {expandedAddress?.zip_code || 'N/A'}</p>
        </OrgDetailCard>
        <ContactsCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AccountCard accounts={accounts || []} />
          <SubaccountsCard accounts={accounts || []} />
        </div>
      </div>
    </div>
  );
}

export default OrgDetail;
