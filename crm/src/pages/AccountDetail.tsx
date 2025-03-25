import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "../api/useAccounts";
import { useAuditStatus } from "../api/useAuditStatus";
import type { AuditStatus } from "../api/useAuditStatus"; // ✅ Add this line
import ContactsCard from "../components/contacts/ContactsCard";
import AddressCard from "../components/shared/AddressCard";
import { Badge } from "flowbite-react";
import { Tooltip } from "flowbite-react"; // make sure it's imported

function getAuditTooltip(status: AuditStatus): string | undefined {
  const today = new Date();
  const anchorDate = status.actualDate ?? status.expectedDate;
  const diffDays = Math.ceil((new Date(anchorDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (status.status === "pending" || status.status === "scheduled") {
    return `T-${Math.abs(diffDays)} days`;
  }

  if (status.status === "missed") {
    return `T+${Math.abs(diffDays)} days`;
  }

  return undefined;
}


export default function AccountDetail() {
  const { id: accountId } = useParams();
  const navigate = useNavigate();

  const { data: account, isLoading, error } = useAccount(accountId);
  const { auditStatus, isLoading: auditLoading, isError: auditError } = useAuditStatus(accountId);

  if (isLoading || auditLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="p-4 text-red-500">
        <strong>Error:</strong> {error?.message || "Account not found"}
      </div>
    );
  }

  if (auditError) {
    return (
      <div className="p-4 text-red-500">
        <strong>Error:</strong> Could not fetch audit status.
      </div>
    );
  }


  const latestAuditStatus = [...auditStatus]
  .sort((a, b) => b.expectedDate.getTime() - a.expectedDate.getTime())[0];


  return (
    <div className="h-screen overflow-y-auto p-4 dark:bg-gray-900 dark:text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Back
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Account: {account.name}</h1>
          {latestAuditStatus && (
  <Tooltip content={getAuditTooltip(latestAuditStatus)}>
    <Badge
      color={
        latestAuditStatus.status === "completed"
          ? "success"
          : latestAuditStatus.status === "pending"
          ? "warning"
          : latestAuditStatus.status === "scheduled"
          ? "info"
          : latestAuditStatus.status === "canceled"
          ? "gray"
          : "failure" // missed
      }
      className="text-xs px-2 py-1 capitalize cursor-help"
    >
      {latestAuditStatus.status}
    </Badge>
  </Tooltip>
)}

        </div>
        <button
          onClick={() => navigate(`/accounts/${accountId}/edit`)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Edit
        </button>
      </div>

      <div className="mb-6">
        <p>
          <strong>Status:</strong> {account.status}
        </p>
        <p>
          <strong>Start:</strong> {account.start_date}
        </p>
        <p>
          <strong>End:</strong> {account.end_date}
        </p>
        {account.expand?.organization && (
          <p>
            <strong>Organization:</strong> {account.expand.organization.name}
          </p>
        )}
      </div>

      {Array.isArray(account.expand?.address) &&
        account.expand.address.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {account.expand.address.map((addr: any) => (
              <AddressCard key={addr.id} type={addr.type} address={addr} />
            ))}
          </div>
        )}

      <ContactsCard
        context="account"
        organizationId={account.expand?.organization?.id || ""}
        accountId={account.id}
      />
    </div>
  );
}
