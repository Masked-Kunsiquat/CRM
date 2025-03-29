// EditOrganization.tsx
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useOrgDetail } from "../../api/useOrgDetail";
import { useUpdateOrganization, Organization } from "../../api/useOrganizations";
import OrganizationForm from "./OrganizationForm";

/**
 * Edit Organization page component.
 * Provides an interface for users to modify an existing organization.
 * 
 * - Fetches current organization data using useOrgDetail
 * - Uses OrganizationForm component for data input with prefilled values
 * - Handles form submission using useUpdateOrganization hook
 * - Redirects to organization detail page after successful update
 */
function EditOrganization() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { data: organizationData, isLoading, error: fetchError } = useOrgDetail();
  const updateMutation = useUpdateOrganization(organizationData?.id || "");
  
  // Convert RecordModel to Organization type
  const organization: Organization | undefined = organizationData ? {
    ...organizationData,
    name: organizationData.name || "",
    active: organizationData.active || false,
    is_home_company: organizationData.is_home_company || false,
  } : undefined;
  
  const handleSubmit = async (formData: any) => {
    if (!organization) return;
    
    try {
      setError(null);
      await updateMutation.mutateAsync(formData);
      navigate(`/organizations/${organization.id}`);
    } catch (err: any) {
      console.error("Error updating organization:", err);
      setError(err.message || "Failed to update organization. Please try again.");
    }
  };
  
  const handleCancel = () => {
    if (organization) {
      navigate(`/organizations/${organization.id}`);
    } else {
      navigate("/organizations");
    }
  };
  
  if (isLoading) return <div>Loading organization data...</div>;
  if (fetchError) return <div>Error: {fetchError.message}</div>;
  if (!organization) return <div>Organization not found.</div>;
  
  return (
    <div className="max-w-3xl mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-6 text-2xl font-semibold dark:text-gray-100">
        Edit Organization: {organization.name}
      </h1>
      
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <OrganizationForm
          organization={organization}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  );
}

export default EditOrganization;