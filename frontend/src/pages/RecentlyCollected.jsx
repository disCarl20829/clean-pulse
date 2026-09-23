import './RecentlyCollected.css';

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
    apiGet('/logs', {
      collectorOnly: 'true',
      sort: activeFilter,
    }).then((res) => setLogs(res.logs || []));
  }, [activeFilter]);

  useEffect(() => {
    if (isCollector) {
      apiGet('/overview/hotspots')
        .then((res) => setHotspots(res.hotspots || []));
    }
  }, [isCollector]);

  return (
    <div className="recently-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="recently-header">

        <div className="recently-header-text">
          <div className="recently-eyebrow">
            COLLECTION MONITORING
          </div>

          <h1>Recently Collected</h1>

          <p>
            View recently completed waste collections and monitor
            collection activity across your assigned areas.
          </p>
        </div>

        <div className="recently-summary">
          <span className="summary-icon">✓</span>

          <div>
            <span className="summary-label">
              Collected Reports
            </span>

            <strong>
              {logs.length}
            </strong>
          </div>
        </div>

      </div>


      {/* ================================
          FILTER / TOOLBAR
      ================================= */}

      <div className="recently-toolbar">

        <div className="toolbar-title">
          <span className="toolbar-icon">≡</span>

          <div>
            <strong>Collection Records</strong>

            <span>
              Sort and review completed collections
            </span>
          </div>
        </div>


        <div className="filter-buttons">

          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={
                activeFilter === f.key
                  ? 'filter-button active'
                  : 'filter-button'
              }
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}

        </div>

      </div>


      {/* ================================
          HOTSPOT MAP
      ================================= */}

      {isCollector && (
        <section className="recently-map-card">

          <div className="map-card-header">

            <div>
              <div className="map-eyebrow">
                FIELD MONITORING
              </div>

              <h2>Waste Hotspots</h2>

              <p>
                Monitor waste locations that may require
                collection attention.
              </p>
            </div>

            <div className="map-count">
              <span>{hotspots.length}</span>
              hotspots
            </div>

          </div>

          <div className="recently-map">
            <HotspotMap hotspots={hotspots} />
          </div>

        </section>
      )}


      {/* ================================
          LOGS
      ================================= */}

      <section className="recently-logs-card">

        <div className="logs-card-header">

          <div>
            <h2>Collection History</h2>

            <p>
              Waste reports marked for collection activity.
            </p>
          </div>

          <div className="record-count">
            {logs.length} records
          </div>

        </div>


        <div className="recently-table">
          {logs.length > 0 ? (
            <LogsTable logs={logs} />
          ) : (
            <div className="recently-empty">

              <div className="empty-circle">
                ✓
              </div>

              <h3>No collection records</h3>

              <p>
                There are currently no recently collected
                reports to display.
              </p>

            </div>
          )}
        </div>

      </section>

    </div>
  );
}

