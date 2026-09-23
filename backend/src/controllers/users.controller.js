const { supabaseAdmin } = require('../config/supabase');
const { ROLES } = require('../utils/constants');

/**
 * Creates the profiles row for a freshly-signed-up Supabase auth user.
 * Uses its own lightweight token check (not requireAuth) because
 * requireAuth expects a profile to already exist.
 */
async function createProfile(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing auth token' });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { fullName, role, barangay } = req.body;

    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Profile already exists for this account' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: fullName || null,
        role,
        barangay: barangay || null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ profile: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createProfile };
