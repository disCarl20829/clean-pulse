const { supabaseAdmin } = require('../config/supabase');

// Powers both the Logs page and the "Recently Collected" tab.
// Recently Collected = status=resolved, sorted by resolution recency by default.
async function getLogs(req, res, next) {
  try {
    const { status, garbageType, barangay, sort = 'recent', collectorOnly } = req.query;

    let query = supabaseAdmin.from('reports').select('*');

    if (status) query = query.eq('status', status);
    if (garbageType) query = query.eq('garbage_type', garbageType);
    if (barangay) query = query.ilike('barangay', `%${barangay}%`);

    // "Recently Collected" default view: resolved reports only
    if (collectorOnly === 'true' && !status) {
      query = query.eq('status', 'resolved');
    }

    if (sort === 'location') {
      query = query.order('barangay', { ascending: true });
    } else if (sort === 'intensity') {
      query = query.order('intensity', { ascending: false });
    } else {
      // 'recent'
      query = query.order(
        collectorOnly === 'true' ? 'status_updated_at' : 'created_at',
        { ascending: false }
      );
    }

    const { data, error } = await query;


    if (error) throw error;

    res.json({ logs: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLogs };
