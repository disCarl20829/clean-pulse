
import './Overview.css';
import { useEffect, useState } from 'react';
import HotspotMap from '../components/HotspotMap';
import { apiGet } from '../lib/api';

export default function Overview() {
  const [hotspots, setHotspots] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadOverview() {
    try {
      setError(null);

      const [hotspotRes, summaryRes] = await Promise.all([
        apiGet('/overview/hotspots'),
        apiGet('/overview/summary')
      ]);

      setHotspots(hotspotRes.hotspots || []);
      setSummary(summaryRes.summary || null);
    } catch (err) {
      console.error('Overview error:', err);
      setError(
        err.message || 'Failed to load overview data.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      loadOverview();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overview-page">
      <div className="overview-content">

        {/* PAGE HEADER */}
        <section className="overview-heading">
          <div>
            <span className="heading-label">
              WASTE MONITORING
            </span>

            <h1>
              Overview
            </h1>

            <p>
              Monitor waste conditions, reported accumulation,
              and active hotspots in your community.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadOverview}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </section>

        {/* ERROR */}
        {error && (
          <div className="overview-error">
            <strong>
              Unable to load overview data
            </strong>

            <span>
              {error}
            </span>

            <button onClick={loadOverview}>
              Try Again
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <section className="overview-stats">

          {/* TOTAL REPORTS */}
          <div className="overview-stat-card">
            <div className="stat-icon">
              ♻
            </div>

            <div className="stat-content">
              <span className="stat-label">
                Total Reports
              </span>

              <strong>
                {loading ? '—' : summary?.total || 0}
              </strong>

              <span className="stat-description">
                All recorded waste reports
              </span>
            </div>
          </div>

          {/* UNRESOLVED */}
          <div className="overview-stat-card unresolved">
            <div className="stat-icon">
              !
            </div>

            <div className="stat-content">
              <span className="stat-label">
                Unresolved
              </span>

              <strong>
                {loading ? '—' : summary?.unresolved || 0}
              </strong>

              <span className="stat-description">
                Reports requiring action
              </span>
            </div>
          </div>

          {/* RESOLVED */}
          <div className="overview-stat-card resolved">
            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">
              <span className="stat-label">
                Resolved
              </span>

              <strong>
                {loading ? '—' : summary?.resolved || 0}
              </strong>

              <span className="stat-description">
                Successfully collected
              </span>
            </div>
          </div>

          {/* ACTIVE HOTSPOTS */}
          <div className="overview-stat-card hotspots">
            <div className="stat-icon">
              ●
            </div>

            <div className="stat-content">
              <span className="stat-label">
                Active Hotspots
              </span>

              <strong>
                {loading ? '—' : hotspots.length}
              </strong>

              <span className="stat-description">
                Areas with recurring reports
              </span>
            </div>
          </div>

        </section>

        {/* HOTSPOT MAP */}
        <section className="overview-section">

          <div className="overview-card hotspot-map-card">

            <div className="overview-card-header">
              <div>
                <span className="section-label">
                  LOCATION MONITORING
                </span>

                <h2>
                  Waste Hotspots
                </h2>

                <p>
                  Locations with reported waste accumulation
                  and recurring waste problems.
                </p>
              </div>

              <div className="hotspot-count-badge">
                {hotspots.length} hotspots
              </div>
            </div>

            <div className="overview-map">

              {loading ? (
                <div className="overview-loading">
                  <div className="loading-spinner"></div>

                  <p>
                    Loading hotspot data...
                  </p>
                </div>
              ) : hotspots.length > 0 ? (
                <HotspotMap hotspots={hotspots} />
              ) : (
                <div className="overview-empty">
                  <div className="empty-icon">
                    ♻
                  </div>

                  <h3>
                    No active hotspots
                  </h3>

                  <p>
                    There are currently no hotspot locations
                    recorded in the system.
                  </p>
                </div>
              )}

            </div>

          </div>

        </section>

        {/* ACTIVE WASTE AREAS */}
        <section className="overview-section">

          <div className="overview-card">

            <div className="overview-card-header">
              <div>
                <span className="section-label">
                  ACTIVE AREAS
                </span>

                <h2>
                  Reported Waste Areas
                </h2>

                <p>
                  Areas currently identified through CleanPulse
                  waste reports.
                </p>
              </div>
            </div>

            {loading ? (

              <div className="list-loading">
                Loading waste areas...
              </div>

            ) : hotspots.length > 0 ? (

              <div className="overview-hotspot-list">

                {hotspots.map((hotspot, index) => {

                  const name =
                    hotspot.location ||
                    hotspot.address ||
                    hotspot.name ||
                    `Waste Area ${index + 1}`;

                  const count =
                    hotspot.count ||
                    hotspot.reportCount ||
                    hotspot.reports ||
                    0;

                  const type =
                    hotspot.garbageType ||
                    hotspot.type ||
                    'Mixed Waste';

                  const intensity =
                    hotspot.intensity ||
                    hotspot.priority ||
                    'Medium';

                  const normalizedIntensity =
                    String(intensity).toLowerCase();

                  return (
                    <div
                      className="overview-hotspot-item"
                      key={
                        hotspot.id ||
                        hotspot.reportId ||
                        hotspot.PK_ReportID ||
                        index
                      }
                    >

                      <div className="hotspot-item-number">
                        {index + 1}
                      </div>

                      <div className="hotspot-item-info">

                        <h3>
                          {name}
                        </h3>

                        <div className="hotspot-item-details">
                          <span>
                            {type}
                          </span>

                          <span className="dot">
                            •
                          </span>

                          <span>
                            {count} report{count === 1 ? '' : 's'}
                          </span>
                        </div>

                      </div>

                      <span
                        className={`hotspot-priority ${normalizedIntensity}`}
                      >
                        {intensity}
                      </span>

                    </div>
                  );
                })}

              </div>

            ) : (

              <div className="overview-empty-list">

                <div className="empty-icon">
                  ✓
                </div>

                <h3>
                  No waste areas recorded
                </h3>

                <p>
                  Active waste locations will appear here
                  when reports are recorded.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* ENVIRONMENTAL MONITORING */}
        <section className="overview-monitoring">

          <div className="monitoring-icon">
            ♻
          </div>

          <div className="monitoring-content">

            <span>
              ENVIRONMENTAL MONITORING
            </span>

            <h2>
              Track recurring waste problems
            </h2>

            <p>
              CleanPulse helps local authorities identify
              areas where waste accumulation repeatedly occurs.
              This information can support faster response,
              better collection coordination, and monitoring
              of waste-related pollution and drainage concerns.
            </p>

          </div>

        </section>

      </div>
    </div>
  );
}
