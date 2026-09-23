const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { createProfile } = require('../controllers/users.controller');

const router = express.Router();

// Called right after supabase.auth.signUp() on the frontend, with the
// fresh session's access token — creates the matching profiles row.
router.post('/profile', createProfile);

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user, profile: req.profile });
});

module.exports = router;
