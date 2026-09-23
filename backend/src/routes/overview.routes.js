const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { getHotspots, getSummary } = require('../controllers/overview.controller');

const router = express.Router();

router.get('/hotspots', requireAuth, getHotspots);
router.get('/summary', requireAuth, getSummary);

module.exports = router;
