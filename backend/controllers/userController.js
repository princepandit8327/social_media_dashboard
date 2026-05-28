const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('followers following', 'username avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('followers following', 'username avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.user.id);
    if (!target) return res.status(404).json({ message: 'Target user not found' });
    if (target.followers.includes(current._id)) {
      return res.status(400).json({ message: 'Already following' });
    }
    target.followers.push(current._id);
    current.following.push(target._id);
    await target.save();
    await current.save();
    res.json({ message: 'Now following', targetId: target._id });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const data = {
      bio: req.body.bio || '',
    };
    if (req.file) {
      data.avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user.id, data, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};
