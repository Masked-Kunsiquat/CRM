/**
 * External dependencies
 */
import { RecordModel } from "pocketbase";

/**
 * Base organization data types
 */

/**
 * Organization interface representing an organization entity in the system.
 * Extends the PocketBase RecordModel to include database record properties.
 *
 * @interface Organization
 * @extends {RecordModel}
 * @property {string} name - The name of the organization
 * @property {string} [description] - Optional description of the organization
 * @property {boolean} active - Whether the organization is currently active
 * @property {string} [address] - Optional physical address of the organization
 * @property {boolean} is_home_company - Indicates if this is the home/primary company
 * @property {string} [logo] - Optional file ID or URL for the organization's logo
 * @property {string} [city] - Optional city derived from the address field
 */
export interface Organization extends RecordModel {
  name: string;
  description?: string;
  active: boolean;
  address?: string;
  is_home_company: boolean;
  logo?: string;
  city?: string; // Derived field
}

/**
 * Data type for creating a new organization.
 * Contains all required fields and optional fields needed to create an organization.
 *
 * @typedef {Object} CreateOrganizationData
 * @property {string} name - The name of the new organization (required)
 * @property {string} [description] - Optional description of the organization
 * @property {string} address - The physical address (required, will be processed to create/update an address record)
 * @property {boolean} [active=true] - Whether the organization is active (defaults to true if not provided)
 * @property {boolean} [is_home_company=false] - Whether this is the home company (defaults to false if not provided)
 * @property {File} [logo] - Optional logo file for the organization
 */
export type CreateOrganizationData = {
  name: string;
  description?: string;
  address: string; // This will be processed to create/update an address record
  active?: boolean;
  is_home_company?: boolean;
  logo?: File;
};

/**
 * Data type for updating an existing organization.
 * All fields are optional since updates may only modify a subset of fields.
 *
 * @typedef {Partial<CreateOrganizationData>} UpdateOrganizationData
 */
export type UpdateOrganizationData = Partial<CreateOrganizationData>;

/**
 * API response types
 */

/**
 * Response type for organization list API endpoint.
 * Contains the list of organizations and pagination information.
 *
 * @typedef {Object} OrganizationListResponse
 * @property {Organization[]} organizations - Array of organization objects
 * @property {number} totalPages - Total number of pages available for pagination
 */
export type OrganizationListResponse = {
  organizations: Organization[];
  totalPages: number;
};

/**
 * Component props types
 */

/**
 * Props for the OrganizationForm component.
 *
 * @interface OrganizationFormProps
 * @property {Organization} [organization] - Optional existing organization data for edit mode
 * @property {Function} onSubmit - Callback function triggered when form is submitted
 * @param {CreateOrganizationData | UpdateOrganizationData} data - The form data to be submitted
 * @property {Function} onCancel - Callback function triggered when form cancellation is requested
 * @property {boolean} isSubmitting - Flag indicating if the form is currently submitting data
 */
export interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: (data: CreateOrganizationData | UpdateOrganizationData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Props for the OrganizationsTable component.
 * Defines the configuration for displaying a table of organizations.
 *
 * @interface OrganizationsTableProps
 * @property {RecordModel[]} organizations - Array of organization records to display
 * @property {Function} [onEdit] - Optional callback function when edit action is triggered
 * @param {string} id - ID of the organization to edit
 * @property {Function} [onDelete] - Optional callback function when delete action is triggered
 * @param {string} id - ID of the organization to delete
 */
export interface OrganizationsTableProps {
  organizations: RecordModel[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Props for the OrgDetailCard component.
 * Used for displaying organization details in a card format.
 *
 * @interface OrgDetailCardProps
 * @property {string} title - Title of the card
 * @property {React.ReactNode} children - Child elements to render within the card
 */
export interface OrgDetailCardProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Props for the CompanyLogo component.
 * Used for displaying and managing organization logos.
 *
 * @interface CompanyLogoProps
 * @property {string | null} logo - The logo file ID or URL, or null if no logo exists
 * @property {string} orgId - ID of the organization the logo belongs to
 * @property {string} [orgName] - Optional name of the organization for alt text and fallbacks
 * @property {string} collectionId - ID of the collection where logo files are stored
 */
export interface CompanyLogoProps {
  logo: string | null;
  orgId: string;
  orgName?: string;
  collectionId: string;
}
