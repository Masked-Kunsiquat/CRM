// OrganizationForm.tsx
import { useState, useEffect } from "react";
import { Button, Label, TextInput, Textarea, Checkbox } from "flowbite-react";
import { CreateOrganizationData, OrganizationFormProps } from "../types";
import getPocketBase from "../../../shared/api/pocketbase";

const pb = getPocketBase();

/**
 * Form component for creating or editing an organization.
 * Handles all organization fields including the address relationship.
 */
export const OrganizationForm = ({
  organization,
  onSubmit,
  onCancel,
  isSubmitting,
}: OrganizationFormProps) => {
  const [formData, setFormData] = useState<
    CreateOrganizationData & { active?: boolean; is_home_company?: boolean }
  >({
    name: "",
    description: "",
    address: "",
    active: true,
    is_home_company: false,
  });

  // If organization is provided, populate form for editing mode
  useEffect(() => {
    const fetchAddressDetails = async () => {
      if (organization) {
        // Clone organization data for form
        const formValues = {
          name: organization.name || "",
          description: organization.description || "",
          address: "", // Will fill this below
          active: organization.active ?? true,
          is_home_company: organization.is_home_company ?? false,
        };

        // Fetch address details if available
        if (organization.address && typeof organization.address === "string") {
          try {
            const addressRecord = await pb
              .collection("address")
              .getOne(organization.address);
            // Format address for display in the form
            const addressParts = [
              addressRecord.street,
              addressRecord.city,
              addressRecord.state,
              addressRecord.zip_code,
            ].filter(Boolean);
            formValues.address = addressParts.join(", ");
          } catch (error) {
            console.error("Failed to fetch address details", error);
          }
        }

        setFormData(formValues);
      }
    };

    fetchAddressDetails();
  }, [organization]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditMode = !!organization;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name" value="Organization Name" />
        </div>
        <TextInput
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter organization name"
        />
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="description" value="Description" />
        </div>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter organization description"
          rows={3}
        />
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="address" value="Address" />
        </div>
        <TextInput
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Street, City, State, Zip"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Format: 123 Main St, Chicago, IL, 60601
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="active"
          name="active"
          checked={formData.active}
          onChange={handleCheckboxChange}
        />
        <Label htmlFor="active">Active Organization</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="is_home_company"
          name="is_home_company"
          checked={formData.is_home_company}
          onChange={handleCheckboxChange}
        />
        <Label htmlFor="is_home_company">Home Company</Label>
        <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          (Internal organization)
        </p>
      </div>

      {/* Logo upload could be added here if needed */}

      <div className="mt-4 flex justify-end gap-2">
        <Button color="gray" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Organization"
              : "Create Organization"}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationForm;
