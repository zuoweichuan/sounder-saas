module.exports = (req, res, next) => {
  // 检查用户是否是管理员
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: '需要管理员权限' });
  }
};
