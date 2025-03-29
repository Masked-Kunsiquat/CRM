"use client";

/**
 * Organization detail page.
 *
 * - Fetches organization and related account data via `useOrgDetail` and `useAccounts`
 * - Displays general info, address, contacts, and optionally accounts/subaccounts
 * - If marked as the "home company", only internal contacts are shown (no accounts/subaccounts)
 * - Includes a back button and organization logo display if available
 * - Provides options to edit or delete the organization
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Alert } from "flowbite-react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useOrgDetail } from "../api/useOrgDetail";
import { useAccounts } from "../../accounts/api/useAccounts";
import { useDeleteOrganization } from "../api/useOrganizations";
import OrgDetailCard from "../components/OrgDetailCard";
import ContactsCard from "../../contacts/components/ContactsCard";
import AccountCard from "../../accounts/components/AccountCard";
import SubaccountsCard from "../../subaccounts/components/SubaccountsCard";
import { CompanyLogo } from "../components/CompanyLogo";
import { RecordModel } from "pocketbase";

function OrgDetail() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
  
  const deleteMutation = useDeleteOrganization();

  const handleEdit = () => {
    if (organization) {
      navigate(`/organizations/${organization.id}/edit`);
    }
  };
  
  const confirmDelete = () => {
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    if (!organization) return;
    
    try {
      setDeleteError(null);
      await deleteMutation.mutateAsync(organization.id);
      setShowDeleteModal(false);
      navigate("/organizations");
    } catch (err: any) {
      console.error("Error deleting organization:", err);
      setDeleteError(err.message || "Failed to delete organization. Please try again.");
    }
  };

  if (orgLoading || accLoading)
    return <div>Loading organization details...</div>;
  if (orgError || accError)
    return <div>Error: {orgError?.message || accError?.message}</div>;
  if (!organization) return <div>Organization not found.</div>;

  const expandedAddress = organization.expand?.address as RecordModel;

  return (
    <div className="min-h-screen p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Back
        </button>
        
        <div className="flex space-x-2">
          <Button color="light" onClick={handleEdit}>
            <HiOutlinePencil className="mr-2 h-5 w-5" />
            Edit
          </Button>
          <Button color="failure" onClick={confirmDelete}>
            <HiOutlineTrash className="mr-2 h-5 w-5" />
            Delete
          </Button>
        </div>
      </div>

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
          <p>Home Company: {organization.is_home_company ? "Yes" : "No"}</p>
          <p>Created: {new Date(organization.created).toLocaleString()}</p>
          <p>Updated: {new Date(organization.updated).toLocaleString()}</p>
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
          <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <AccountCard accounts={accounts || []} />
            <SubaccountsCard accounts={accounts || []} />
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong>{organization.name}</strong>? This action cannot be undone.
            </p>
            {deleteError && (
              <Alert color="failure">
                {deleteError}
              </Alert>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            color="failure" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Organization'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrgDetail;