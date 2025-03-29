// CreateOrganization.tsx
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import { useCreateOrganization } from "../api/useOrganizations";
import OrganizationForm from "../components/OrganizationForm";

/**
 * Create Organization page component.
 * Provides an interface for users to create a new organization entry.
 *
 * - Uses the OrganizationForm component for data input
 * - Handles form submission using useCreateOrganization hook
 * - Redirects to the organizations list on successful creation
 */
function CreateOrganization() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createMutation = useCreateOrganization();

  const handleSubmit = async (formData: any) => {
    try {
      setError(null);
      await createMutation.mutateAsync(formData);
      navigate("/organizations");
    } catch (err: any) {
      console.error("Error creating organization:", err);
      setError(
        err.message || "Failed to create organization. Please try again.",
      );
    }
  };

  const handleCancel = () => {
    navigate("/organizations");
  };

  return (
    <div className="mx-auto max-w-3xl p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-6 text-2xl font-semibold dark:text-gray-100">
        Create New Organization
      </h1>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <OrganizationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}

export default CreateOrganization;
