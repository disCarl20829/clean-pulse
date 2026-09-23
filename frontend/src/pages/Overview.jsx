import './Overview.css';
import { useEffect, useState } from 'react';
import HotspotMap from '../components/HotspotMap';
import { apiGet } from '../lib/api';
import './Overview.css';

export default function Overview() {
  const [hotspots, setHotspots] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet('/overview/hotspots')
      .then((res) => setHotspots(res.hotspots))
      .catch((e) => setError(e.message));

    apiGet('/overview/summary')
      .then((res) => setSummary(res.summary))
      .catch(() => {});
  }, []);

  return (
    <div className="overview-page">

      {/* Header */}
      <div className="overview-header">
        <div>
          <h1>Overview</h1>
          <p>
            Monitor waste conditions and active hotspots in your community.
          </p>
        </div>
      </div>


      {/* Summary Cards */}
      {summary && (
        <div className="overview-stats">

          <div className="overview-stat-card">
            <div className="stat-icon">♻</div>

            <div>
              <span className="stat-label">
                Total Reports
              </span>

              <strong>
                {summary.total}
              </strong>
            </div>
          </div>


          <div className="overview-stat-card unresolved">
            <div className="stat-icon">!</div>

            <div>
              <span className="stat-label">
                Unresolved
              </span>

              <strong>
                {summary.unresolved || 0}
              </strong>
            </div>
          </div>


          <div className="overview-stat-card resolved">
            <div className="stat-icon">✓</div>

            <div>
              <span className="stat-label">
                Resolved
              </span>

              <strong>
                {summary.resolved || 0}
              </strong>
            </div>
          </div>

        </div>
      )}


      {/* Error */}
      {error && (
        <div className="overview-error">
          {error}
        </div>
      )}


      {/* Hotspot Map */}
      <div className="hotspot-card">

        <div className="hotspot-header">
          <div>
            <h2>Waste Hotspots</h2>

            <p>
              Locations with reported waste accumulation.
            </p>
          </div>

          <span className="hotspot-count">
            {hotspots.length} hotspots
          </span>
        </div>

        <div className="hotspot-map">
          <HotspotMap hotspots={hotspots} />
        </div>

      </div>

    </div>
  );
}

