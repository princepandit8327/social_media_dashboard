const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createPost = async (req, res, next) => {
  try {
    const mediaUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';
    const post = await Post.create({ author: req.user.id, caption: req.body.caption || '', mediaUrl });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

exports.getFeed = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.likes.includes(req.user.id)) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
      await Notification.create({
        user: post.author,
        sourceUser: req.user.id,
        type: 'like',
        text: 'Someone liked your post.'
      });
    }
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.commentPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = { user: req.user.id, text: req.body.text };
    post.comments.push(comment);
    await Notification.create({
      user: post.author,
      sourceUser: req.user.id,
      type: 'comment',
      text: `${req.body.text.slice(0, 120)}`
    });
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};
