const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { getLogs } = require('../controllers/logs.controller');

const router = express.Router();

router.get('/', requireAuth, getLogs);

module.exports = router;
