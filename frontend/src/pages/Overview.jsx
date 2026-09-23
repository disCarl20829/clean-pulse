import { useEffect, useState } from 'react';
import HotspotMap from '../components/HotspotMap';
import { apiGet } from '../lib/api';

export default function Overview() {
  const [hotspots, setHotspots] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet('/overview/hotspots').then((res) => setHotspots(res.hotspots)).catch((e) => setError(e.message));
    apiGet('/overview/summary').then((res) => setSummary(res.summary)).catch(() => {});
  }, []);

  return (
    <div>
      <h2>Overview</h2>
      {summary && (
        <p>
          Total: {summary.total} · Unresolved: {summary.unresolved || 0} · Resolved: {summary.resolved || 0}
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <HotspotMap hotspots={hotspots} />
    </div>
  );
}
