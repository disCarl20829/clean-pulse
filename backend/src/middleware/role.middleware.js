/**
 * Usage: router.get('/path', requireAuth, requireRole('lgu_admin', 'barangay_official'), handler)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.profile) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.profile.role)) {
      return res.status(403).json({ error: 'Insufficient role permissions' });
    }
    next();
  };
}

module.exports = { requireRole };
