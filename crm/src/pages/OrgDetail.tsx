"use client";

/**
 * Organization detail page.
 *
 * - Fetches organization and related account data via `useOrgDetail` and `useAccounts`
 * - Displays general info, address, contacts, and optionally accounts/subaccounts
 * - If marked as the "home company", only internal contacts are shown (no accounts/subaccounts)
 * - Includes a back button and organization logo display if available
 */

import { useNavigate } from "react-router-dom";
import { useOrgDetail } from "../api/useOrgDetail";
import { useAccounts } from "../api/useAccounts";
import OrgDetailCard from "../components/organizations/OrgDetailCard";
import ContactsCard from "../components/contacts/ContactsCard";
import AccountCard from "../components/accounts/AccountCard";
import SubaccountsCard from "../components/subaccounts/SubaccountsCard";
import { CompanyLogo } from "../components/organizations/CompanyLogo";
import { RecordModel } from "pocketbase";

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

  if (orgLoading || accLoading)
    return <div>Loading organization details...</div>;
  if (orgError || accError)
    return <div>Error: {orgError?.message || accError?.message}</div>;
  if (!organization) return <div>Organization not found.</div>;

  const expandedAddress = organization.expand?.address as RecordModel;

  return (
    <div className="min-h-screen p-4 dark:bg-gray-900 dark:text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Back
      </button>

      <div className="mb-4 flex flex-col items-start justify-between md:flex-row">
        <h1 className="text-3xl font-semibold dark:text-gray-100">
          {organization.name}
        </h1>
        {organization.logo && organization.collectionId && (
          <CompanyLogo
            logo={organization.logo}
            orgId={organization.id}
            orgName={organization.name}
            collectionId={organization.collectionId}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <OrgDetailCard title="Organization Details">
          <p>ID: {organization.id}</p>
          <p>Active: {organization.active ? "Yes" : "No"}</p>
          <p>Created: {organization.created}</p>
          <p>Updated: {organization.updated}</p>
        </OrgDetailCard>

        <OrgDetailCard title="Address">
          <p>Street: {expandedAddress?.street || "N/A"}</p>
          <p>City: {expandedAddress?.city || "N/A"}</p>
          <p>State: {expandedAddress?.state || "N/A"}</p>
          <p>Zip: {expandedAddress?.zip_code || "N/A"}</p>
        </OrgDetailCard>

        <div className={organization.is_home_company ? "col-span-2" : ""}>
          <ContactsCard
            context="organization"
            organizationId={organization.id}
            isHomeCompany={organization.is_home_company}
          />
        </div>

        {!organization.is_home_company && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AccountCard accounts={accounts || []} />
            <SubaccountsCard accounts={accounts || []} />
          </div>
        )}
      </div>
    </div>
  );
}

export default OrgDetail;
