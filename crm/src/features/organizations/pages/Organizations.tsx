// Organizations.tsx
"use client";

/**
 * Organizations list page.
 *
 * - Fetches a paginated list of organizations using `useOrganizations`
 * - Renders a reusable `OrganizationsTable`
 * - Includes basic pagination controls (Previous / Next)
 * - Provides option to create, edit, and delete organizations
 * - Handles loading and error states
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Alert } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import { useOrganizations, useDeleteOrganization } from "../api/useOrganizations";
import { OrganizationsTable } from "../components/OrganizationsTable";

function Organizations() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useOrganizations(page, perPage);
  const deleteMutation = useDeleteOrganization();

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };
  
  const handleCreateOrganization = () => {
    navigate("/organizations/create");
  };
  
  const handleEditOrganization = (id: string) => {
    navigate(`/organizations/${id}/edit`);
  };
  
  const confirmDelete = (id: string) => {
    setSelectedOrgId(id);
    setShowDeleteModal(true);
  };
  
  const handleDeleteOrganization = async () => {
    if (!selectedOrgId) return;
    
    try {
      setDeleteError(null);
      await deleteMutation.mutateAsync(selectedOrgId);
      setShowDeleteModal(false);
      setSelectedOrgId(null);
    } catch (err: any) {
      console.error("Error deleting organization:", err);
      setDeleteError(err.message || "Failed to delete organization. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen p-4 dark:bg-gray-900 dark:text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen p-4 dark:bg-gray-900 dark:text-white">
        <p>Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold dark:text-gray-100">
          Organizations
        </h1>
        <Button 
          color="blue"
          onClick={handleCreateOrganization}
        >
          <HiOutlinePlus className="mr-2 h-5 w-5" />
          New Organization
        </Button>
      </div>
      
      <OrganizationsTable 
        organizations={data?.organizations || []} 
        onEdit={handleEditOrganization}
        onDelete={confirmDelete}
      />
      
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
        >
          Previous
        </button>
        <span className="mx-2 flex items-center dark:text-white">
          Page {page} of {data?.totalPages || 1}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === data?.totalPages}
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
        >
          Next
        </button>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this organization? This action cannot be undone.
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
            onClick={handleDeleteOrganization}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Organization'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Organizations;