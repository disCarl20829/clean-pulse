import './Logs.css';
import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../lib/api';
import { GARBAGE_TYPES } from '../constants/garbageTypes';

export default function Unresolved() {
  const [reports, setReports] = useState([]);
  const [garbageType, setGarbageType] = useState('');
  const [sort, setSort] = useState('recent');

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  useEffect(() => {
    loadReports();
  }, [garbageType, sort]);

  async function loadReports() {
    setLoading(true);
    setError('');

    try {
      const res = await apiGet('/logs', {
        status: 'unresolved',
        garbageType,
        sort
      });

      setReports(res.logs || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || 'Failed to load unresolved reports.');
    } finally {
      setLoading(false);
    }
  }

  async function markAsCollected(reportId) {
    const confirmed = window.confirm(
      'Has this garbage already been collected?'
    );

    if (!confirmed) return;

    setUpdatingId(reportId);
    setError('');

    try {
      /*
       * Change this endpoint if your backend
       * uses a different route.
       */
      await apiPatch(
        `/reports/${reportId}/status`,
        {
          status: 'resolved'
        }
      );

      // Remove the report from the unresolved list
      setReports((currentReports) =>
        currentReports.filter(
          (report) =>
            report.id !== reportId &&
            report.reportId !== reportId &&
            report.PK_ReportID !== reportId
        )
      );

    } catch (err) {
      setError(
        err.message || 'Failed to update report status.'
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // Pagination
  const totalPages = Math.ceil(
    reports.length / reportsPerPage
  );

  const startIndex =
    (currentPage - 1) * reportsPerPage;

  const endIndex =
    startIndex + reportsPerPage;

  const currentReports =
    reports.slice(startIndex, endIndex);

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

          <h1>
            Unresolved Reports
          </h1>

          <p>
            View waste reports that still require collection
            and update their status once the garbage has been collected.
          </p>

        </div>

      </div>


      {/* Main Card */}

      <div className="logs-card">

        {/* Filters */}

        <div className="logs-filters">

          <div className="filter-group">

            <label>
              Garbage Type
            </label>

            <select
              value={garbageType}
              onChange={(e) =>
                setGarbageType(e.target.value)
              }
            >

              <option value="">
                All types
              </option>

              {GARBAGE_TYPES.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}

            </select>

          </div>


          <div className="filter-group">

            <label>
              Sort By
            </label>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
            >

              <option value="recent">
                Recent
              </option>

              <option value="location">
                Location
              </option>

              <option value="intensity">
                Intensity
              </option>

            </select>

          </div>

        </div>


        {/* Results Information */}

        <div className="logs-results-info">

          <span>
            Showing{' '}
            {reports.length === 0
              ? 0
              : startIndex + 1}
            {' '}to{' '}
            {Math.min(
              endIndex,
              reports.length
            )}
            {' '}of{' '}
            {reports.length} unresolved reports
          </span>

        </div>


        {/* Error */}

        {error && (
          <div className="logs-error">
            {error}
          </div>
        )}


        {/* Table */}

        <div className="logs-table-container">

          {loading ? (

            <div className="logs-empty">

              <div className="empty-icon">
                ♻
              </div>

              <h3>
                Loading reports...
              </h3>

              <p>
                Please wait while unresolved reports are loaded.
              </p>

            </div>

          ) : currentReports.length > 0 ? (

            <div className="unresolved-table-wrapper">

              <table className="unresolved-table">

                <thead>

                  <tr>

                    <th>
                      Report
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Priority
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentReports.map((report) => {

                    const reportId =
                      report.id ||
                      report.reportId ||
                      report.PK_ReportID;

                    return (

                      <tr key={reportId}>

                        <td>

                          <strong>
                            {report.reportCode ||
                              report.code ||
                              `CP-${reportId}`}
                          </strong>

                        </td>


                        <td>
                          {report.location ||
                            report.address ||
                            'Location unavailable'}
                        </td>


                        <td>
                          {report.garbageType ||
                            report.type ||
                            'Unknown'}
                        </td>


                        <td>

                          <span
                            className={`unresolved-priority ${
                              String(
                                report.intensity ||
                                report.priority ||
                                ''
                              ).toLowerCase()
                            }`}
                          >
                            {report.intensity ||
                              report.priority ||
                              '—'}
                          </span>

                        </td>


                        <td>

                          <span className="unresolved-status">
                            Unresolved
                          </span>

                        </td>


                        <td>

                          <button
                            className="collected-button"
                            onClick={() =>
                              markAsCollected(reportId)
                            }
                            disabled={
                              updatingId === reportId
                            }
                          >

                            {updatingId === reportId
                              ? 'Updating...'
                              : 'Mark as Collected'}

                          </button>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="logs-empty">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                All reports are resolved
              </h3>

              <p>
                There are currently no unresolved
                garbage reports requiring collection.
              </p>

            </div>

          )}

        </div>


        {/* Pagination */}

        {totalPages > 1 && (

          <div className="logs-pagination">

            <button
              className="pagination-button"
              onClick={() =>
                goToPage(currentPage - 1)
              }
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
                  onClick={() =>
                    goToPage(page)
                  }
                >
                  {page}
                </button>

              ))}

            </div>


            <button
              className="pagination-button"
              onClick={() =>
                goToPage(currentPage + 1)
              }
              disabled={
                currentPage === totalPages
              }
            >
              Next →
            </button>

          </div>

        )}

      </div>

    </div>
  );
}
