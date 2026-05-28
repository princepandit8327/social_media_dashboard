const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
