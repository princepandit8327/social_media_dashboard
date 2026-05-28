const express = require('express');
const { createPost, getFeed, likePost, commentPost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', protect, getFeed);
router.post('/', protect, upload.single('media'), createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);

module.exports = router;
