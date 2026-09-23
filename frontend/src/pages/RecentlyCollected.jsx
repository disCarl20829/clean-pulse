import { useEffect, useState } from 'react';
import LogsTable from '../components/LogsTable';
import HotspotMap from '../components/HotspotMap';
import { apiGet } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const FILTERS = [
  { key: 'recent', label: 'Recent' },
  { key: 'location', label: 'Location' },
  { key: 'intensity', label: 'Intensity' },
];

export default function RecentlyCollected() {
  const { role } = useAuth();
  const [logs, setLogs] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [activeFilter, setActiveFilter] = useState('recent');

  const isCollector = role === 'garbage_collector';

  useEffect(() => {
    apiGet('/logs', { collectorOnly: 'true', sort: activeFilter }).then((res) => setLogs(res.logs));
  }, [activeFilter]);

  useEffect(() => {
    if (isCollector) {
      apiGet('/overview/hotspots').then((res) => setHotspots(res.hotspots));
    }
  }, [isCollector]);

  return (
    <div>
      <h2>Recently Collected</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{ fontWeight: activeFilter === f.key ? 'bold' : 'normal' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map only shown for garbage_collector accounts */}
      {isCollector && <HotspotMap hotspots={hotspots} />}

      <LogsTable logs={logs} />
    </div>
  );
}
