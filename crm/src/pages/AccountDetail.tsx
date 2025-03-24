import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from '../api/useAccounts';
import ContactsCard from '../components/contacts/ContactsCard';
import AddressCard from '../components/shared/AddressCard';

export default function AccountDetail() {
  const { id: accountId } = useParams();
  const navigate = useNavigate();

  const { data: account, isLoading, error } = useAccount(accountId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="text-red-500 p-4">
        <strong>Error:</strong> {error?.message || "Account not found"}
      </div>
    );
  }

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white h-screen overflow-y-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back
      </button>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Account: {account.name}</h1>
        <button
          onClick={() => navigate(`/accounts/${accountId}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
      </div>

      <div className="mb-6">
        <p><strong>Status:</strong> {account.status}</p>
        <p><strong>Start:</strong> {account.start_date}</p>
        <p><strong>End:</strong> {account.end_date}</p>
        {account.expand?.organization && (
          <p><strong>Organization:</strong> {account.expand.organization.name}</p>
        )}
      </div>

      {Array.isArray(account.expand?.address) && account.expand.address.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {account.expand.address.map((addr: any) => (
            <AddressCard key={addr.id} type={addr.type} address={addr} />
          ))}
        </div>
      )}

      <ContactsCard
        context="account"
        organizationId={account.expand?.organization?.id || ''}
        accountId={account.id}
      />
    </div>
  );
}
