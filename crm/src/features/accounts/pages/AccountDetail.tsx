import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "../api/useAccounts";
import { useAuditStatus } from "../../audits/api/useAuditStatus";
import { useAccountAudits } from "../../audits/api/useAccountAudits";
import ContactsCard from "../../contacts/components/ContactsCard";
import AddressCard from "../../../shared/components/AddressCard";
import FloorMatrix from "../components/FloorMatrix/index";
import { Badge, Tooltip } from "flowbite-react";
import { AuditStatus } from "../types";

function getAuditTooltip(status: AuditStatus): string | undefined {
  const today = new Date();
  const anchorDate = status.actualDate ?? status.expectedDate;
  const diffDays = Math.ceil(
    (new Date(anchorDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

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
  const {
    auditStatus,
    isLoading: auditStatusLoading,
    isError: auditStatusError,
  } = useAuditStatus(accountId);

  // Fetch audits with floor visit data
  const {
    data: auditData,
    isLoading: auditDataLoading,
    isError: auditDataError,
  } = useAccountAudits(accountId, account);

  if (isLoading || auditStatusLoading || auditDataLoading) {
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

  if (auditStatusError || auditDataError) {
    return (
      <div className="p-4 text-red-500">
        <strong>Error:</strong> {auditStatusError ? "Could not fetch audit status." : "Could not fetch audit data."}
      </div>
    );
  }

  const latestAuditStatus = auditStatus.length > 0
    ? [...auditStatus].sort(
        (a, b) => b.expectedDate.getTime() - a.expectedDate.getTime(),
      )[0]
    : null;

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
                className="cursor-help px-2 py-1 text-xs capitalize"
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
      
      {/* Floor Matrix Card moved to the bottom */}
      {auditData?.floorMatrix && (
        <div className="mt-6">
          <FloorMatrix 
            data={auditData.floorMatrix} 
            title={`Floor Visit History (${account.floors_min || 1}-${account.floors_max || 1})`} 
            className="w-full"
            audits={auditData.audits}
          />
        </div>
      )}
      {!auditData?.floorMatrix && account.floors_min && account.floors_max && (
        <div className="overflow-x-auto p-2 pl-4 mt-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Floor Visit History
          </h5>
          <p className="text-gray-500 dark:text-gray-400">
            {auditData?.audits?.length ? 
              "Floor matrix could not be generated. Check floor configuration." : 
              "No audit data available for this account yet."
            }
          </p>
        </div>
      )}
    </div>
  );
}