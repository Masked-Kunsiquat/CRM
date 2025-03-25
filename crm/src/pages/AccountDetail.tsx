import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "../api/useAccounts";
import ContactsCard from "../components/contacts/ContactsCard";
import AddressCard from "../components/shared/AddressCard";

export default function AccountDetail() {
  const { id: accountId } = useParams();
  const navigate = useNavigate();

  const { data: account, isLoading, error } = useAccount(accountId);

  if (isLoading) {
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

  return (
    <div className="h-screen overflow-y-auto p-4 dark:bg-gray-900 dark:text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Back
      </button>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account: {account.name}</h1>
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
