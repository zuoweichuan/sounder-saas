exports.getProfile = async (req, res) => {
  try {
    // 暂时返回模拟用户数据
    res.status(200).json({
      user: {
        id: '123456',
        name: '西南小天才',
        email: 'test@example.com',
        role: 'admin',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // 暂时返回成功响应
    res.status(200).json({
      message: '用户资料更新成功',
      user: {
        id: '123456',
        name: req.body.name || '西南小天才',
        email: 'test@example.com',
        role: 'admin',
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('更新用户资料错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};
