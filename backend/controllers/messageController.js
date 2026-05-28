const Message = require('../models/Message');

exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const message = await Message.create({ sender: req.user.id, recipient: recipientId, content });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { withUserId } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: withUserId },
        { sender: withUserId, recipient: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
