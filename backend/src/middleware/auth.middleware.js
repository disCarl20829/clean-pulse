const { supabaseAdmin } = require('../config/supabase');

/**
 * Verifies the Supabase access token sent from the frontend
 * as: Authorization: Bearer <token>
 * Attaches req.user and req.profile (role, barangay, etc.) on success.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'No profile found for this user' });
    }

    req.user = userData.user;
    req.profile = profile;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
