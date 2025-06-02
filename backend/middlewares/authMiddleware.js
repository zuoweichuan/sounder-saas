const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // 获取请求头中的认证信息
    const authHeader = req.headers.authorization;
    
    // 检查是否提供了令牌
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }
    
    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // 查找用户并检查租户
    const user = await User.findById(decoded.id).populate('tenantId');
    
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    
    if (user.tenantId.status !== 'active') {
      return res.status(403).json({ message: '租户已停用或暂停' });
    }
    
    // 将用户和租户信息添加到请求对象中
    req.userData = decoded;
    req.user = user;
    req.tenant = user.tenantId;
    
    // 继续执行下一个中间件或路由处理器
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    return res.status(401).json({ message: '认证失败', error: error.message });
  }
};
