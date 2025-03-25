// OrganizationsTable.tsx
import { RecordModel } from "pocketbase";
import DataTable from "../shared/DataTable";

interface OrganizationsTableProps {
  organizations: RecordModel[];
}

/**
 * Displays a table of organization records using the shared `DataTable` component.
 *
 * - Shows columns: Name, Active status, City, Created, and Updated timestamps.
 * - Enables row linking via `entityPath="organizations"`
 *
 * @param {OrganizationsTableProps} props - Props containing organization records
 * @returns {JSX.Element} A data table displaying the organizations
 */
export const OrganizationsTable = ({
  organizations,
}: OrganizationsTableProps) => {
  const fieldsToDisplay = ["name", "active", "city", "created", "updated"];

  return (
    <DataTable
      data={organizations}
      fields={fieldsToDisplay}
      entityPath="organizations"
    />
  );
};
