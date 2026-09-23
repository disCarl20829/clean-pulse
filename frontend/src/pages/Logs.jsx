
import './Logs.css';
import { useEffect, useState } from 'react';
import LogsTable from '../components/LogsTable';
import { apiGet } from '../lib/api';
import { GARBAGE_TYPES, REPORT_STATUS } from '../constants/garbageTypes';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('');
  const [garbageType, setGarbageType] = useState('');
  const [sort, setSort] = useState('recent');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 8;

  useEffect(() => {
    apiGet('/logs', { status, garbageType, sort })
      .then((res) => {
        setLogs(res.logs || []);
        setCurrentPage(1);
      });
  }, [status, garbageType, sort]);

  // Calculate pagination
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;

  const currentLogs = logs.slice(startIndex, endIndex);

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  return (
    <div className="logs-page">

      {/* Header */}
      <div className="logs-header">
        <div>
          <h1>Logs</h1>

          <p>
            View and monitor waste reports submitted through CleanPulse.
          </p>
        </div>
      </div>


      {/* Logs Card */}
      <div className="logs-card">

        {/* Filters */}
        <div className="logs-filters">

          <div className="filter-group">
            <label>Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>

              {REPORT_STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>


          <div className="filter-group">
            <label>Garbage Type</label>

            <select
              value={garbageType}
              onChange={(e) => setGarbageType(e.target.value)}
            >
              <option value="">All types</option>

              {GARBAGE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>


          <div className="filter-group">
            <label>Sort By</label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recent">Recent</option>
              <option value="location">Location</option>
              <option value="intensity">Intensity</option>
            </select>
          </div>

        </div>


        {/* Results Information */}
        <div className="logs-results-info">
          <span>
            Showing{' '}
            {logs.length === 0 ? 0 : startIndex + 1}
            {' '}to{' '}
            {Math.min(endIndex, logs.length)}
            {' '}of{' '}
            {logs.length} reports
          </span>
        </div>


        {/* Table */}
        <div className="logs-table-container">

          {currentLogs.length > 0 ? (
            <LogsTable logs={currentLogs} />
          ) : (
            <div className="logs-empty">
              <div className="empty-icon">♻</div>

              <h3>No reports found</h3>

              <p>
                There are no waste reports matching the selected filters.
              </p>
            </div>
          )}

        </div>


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="logs-pagination">

            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>


            <div className="pagination-pages">

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page
                      ? 'pagination-page active'
                      : 'pagination-page'
                  }
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

            </div>


            <button
              className="pagination-button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

