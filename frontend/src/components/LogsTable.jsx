import StatusBadge from './StatusBadge';

export default function LogsTable({ logs = [] }) {
  if (!logs.length) return <p>No reports found.</p>;

  return (
    <table width="100%" cellPadding="8">
      <thead>
        <tr>
          <th align="left">Date</th>
          <th align="left">Location</th>
          <th align="left">Type</th>
          <th align="left">Intensity</th>
          <th align="left">Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{new Date(log.created_at).toLocaleString()}</td>
            <td>{log.barangay || log.formatted_address || `${log.lat}, ${log.lng}`}</td>
            <td style={{ textTransform: 'capitalize' }}>{log.garbage_type?.replace('_', ' ')}</td>
            <td style={{ textTransform: 'capitalize' }}>{log.intensity}</td>
            <td><StatusBadge status={log.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
