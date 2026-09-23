const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { upload } = require('../middleware/upload.middleware');
const {
  createReport,
  listReports,
  updateReportStatus,
} = require('../controllers/reports.controller');

const router = express.Router();

router.post('/', requireAuth, upload.single('photo'), createReport);
router.get('/', requireAuth, listReports);
router.patch(
  '/:id/status',
  requireAuth,
  requireRole('barangay_official', 'garbage_collector', 'lgu_admin'),
  updateReportStatus
);

module.exports = router;
