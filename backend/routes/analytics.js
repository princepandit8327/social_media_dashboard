const express = require('express');
const { engagementStats, topPosts } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', protect, engagementStats);
router.get('/top-posts', protect, topPosts);

module.exports = router;
