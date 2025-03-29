// OrganizationsTable.tsx
import { Link } from "react-router-dom";
import { Table, Badge, Button } from "flowbite-react";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import { OrganizationsTableProps } from "../types";

/**
 * Displays a table of organization records with action buttons.
 *
 * - Shows columns: Name, Active status, City, Created, and Updated timestamps
 * - Provides view, edit, and delete actions for each organization
 * - Handles click events for edit and delete via props
 *
 * @param {OrganizationsTableProps} props - Props containing organization records and action handlers
 * @returns {JSX.Element} A data table displaying the organizations
 */
export const OrganizationsTable = ({
  organizations,
  onEdit,
  onDelete,
}: OrganizationsTableProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>City</Table.HeadCell>
          <Table.HeadCell>Created</Table.HeadCell>
          <Table.HeadCell>Updated</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <Table.Row
                key={org.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Link
                    to={`/organizations/${org.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {org.name}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {org.active ? (
                    <Badge color="success">Active</Badge>
                  ) : (
                    <Badge color="gray">Inactive</Badge>
                  )}
                </Table.Cell>
                <Table.Cell>{org.city || "N/A"}</Table.Cell>
                <Table.Cell>{formatDate(org.created)}</Table.Cell>
                <Table.Cell>{formatDate(org.updated)}</Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Link to={`/organizations/${org.id}`}>
                      <Button size="xs" color="light">
                        <HiEye className="h-4 w-4" />
                      </Button>
                    </Link>

                    {onEdit && (
                      <Button
                        size="xs"
                        color="info"
                        onClick={() => onEdit(org.id)}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => onDelete(org.id)}
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={6} className="py-4 text-center">
                No organizations found
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};
