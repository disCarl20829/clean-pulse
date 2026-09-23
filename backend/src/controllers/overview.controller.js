const { supabaseAdmin } = require('../config/supabase');
const { buildHotspots } = require('../services/hotspot.service');

async function getHotspots(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('lat, lng, intensity, status')
      .neq('status', 'archived');

    if (error) throw error;

    res.json({ hotspots: buildHotspots(data) });
  } catch (err) {
    next(err);
  }
}

async function getSummary(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin.from('reports').select('status');
    if (error) throw error;

    const summary = data.reduce(
      (acc, r) => {
        acc.total += 1;
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { total: 0 }
    );

    res.json({ summary });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHotspots, getSummary };
