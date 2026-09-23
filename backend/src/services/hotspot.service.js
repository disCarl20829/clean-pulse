const { INTENSITY_LEVELS } = require('../utils/constants');

const intensityWeight = (level) => INTENSITY_LEVELS.indexOf(level) + 1; // 1..5

// Rough distance-based clustering (grid rounding). Fine for a hackathon demo;
// swap for PostGIS ST_ClusterDBSCAN later if you have time.
const GRID_PRECISION = 3; // ~110m grid cells

function gridKey(lat, lng) {
  return `${lat.toFixed(GRID_PRECISION)}_${lng.toFixed(GRID_PRECISION)}`;
}

/**
 * @param {Array} reports - rows with lat, lng, intensity, status
 * @returns {Array} hotspot points: { lat, lng, weight, reportCount }
 */
function buildHotspots(reports) {
  const cells = new Map();

  for (const report of reports) {
    if (report.status === 'archived') continue;
    const key = gridKey(report.lat, report.lng);
    const existing = cells.get(key) || { latSum: 0, lngSum: 0, weight: 0, count: 0 };

    existing.latSum += report.lat;
    existing.lngSum += report.lng;
    existing.weight += intensityWeight(report.intensity);
    existing.count += 1;

    cells.set(key, existing);
  }

  return Array.from(cells.values()).map((cell) => ({
    lat: cell.latSum / cell.count,
    lng: cell.lngSum / cell.count,
    weight: cell.weight,
    reportCount: cell.count,
  }));
}

module.exports = { buildHotspots };
