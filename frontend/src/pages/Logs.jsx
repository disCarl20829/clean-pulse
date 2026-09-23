import { useEffect, useState } from 'react';
import LogsTable from '../components/LogsTable';
import { apiGet } from '../lib/api';
import { GARBAGE_TYPES, REPORT_STATUS } from '../constants/garbageTypes';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('');
  const [garbageType, setGarbageType] = useState('');
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    apiGet('/logs', { status, garbageType, sort }).then((res) => setLogs(res.logs));
  }, [status, garbageType, sort]);

  return (
    <div>
      <h2>Logs</h2>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        {REPORT_STATUS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select value={garbageType} onChange={(e) => setGarbageType(e.target.value)}>
        <option value="">All types</option>
        {GARBAGE_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="recent">Sort: Recent</option>
        <option value="location">Sort: Location</option>
        <option value="intensity">Sort: Intensity</option>
      </select>

      <LogsTable logs={logs} />
    </div>
  );
}
