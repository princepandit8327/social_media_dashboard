const express = require('express');
const { getProfile, getMe, followUser, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/me', protect, getMe);
router.get('/:id', protect, getProfile);
router.put('/:id/follow', protect, followUser);
router.put('/me', protect, upload.single('avatar'), updateProfile);

module.exports = router;
