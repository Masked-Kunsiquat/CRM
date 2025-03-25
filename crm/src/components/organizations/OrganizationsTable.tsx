// OrganizationsTable.tsx
import { RecordModel } from "pocketbase";
import DataTable from "../shared/DataTable";

interface OrganizationsTableProps {
  organizations: RecordModel[];
}

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
