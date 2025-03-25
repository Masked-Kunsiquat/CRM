// crm/src/components/AuditStatusComponent.tsx
import { useAuditStatus } from '../api/useAuditStatus';

const AuditStatusComponent = ({ accountId }: { accountId: string }) => {
  const { auditStatus, isLoading, isError } = useAuditStatus(accountId);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching audit data.</p>;

  return (
    <div>
      <h3>Audit Status for Account: {accountId}</h3>
      <table>
        <thead>
          <tr>
            <th>Expected Date</th>
            <th>Status</th>
            <th>Actual Date</th>
          </tr>
        </thead>
        <tbody>
          {auditStatus.map((item, index) => (
            <tr key={index}>
              <td>{item.expectedDate.toDateString()}</td>
              <td>{item.status}</td>
              <td>{item.actualDate ? item.actualDate.toDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditStatusComponent;
