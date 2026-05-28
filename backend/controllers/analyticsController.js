const Post = require('../models/Post');
const User = require('../models/User');
const Message = require('../models/Message');

exports.engagementStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalMessages = await Message.countDocuments();
    const likesAggregation = await Post.aggregate([
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } }
    ]);
    const commentsAggregation = await Post.aggregate([
      { $project: { commentsCount: { $size: '$comments' } } },
      { $group: { _id: null, totalComments: { $sum: '$commentsCount' } } }
    ]);
    res.json({
      totalUsers,
      totalPosts,
      totalMessages,
      totalLikes: likesAggregation[0]?.totalLikes || 0,
      totalComments: commentsAggregation[0]?.totalComments || 0
    });
  } catch (error) {
    next(error);
  }
};

exports.topPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ 'likes.length': -1, 'comments.length': -1, createdAt: -1 })
      .limit(5)
      .populate('author', 'username avatar');
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
