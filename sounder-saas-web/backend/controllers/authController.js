const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// 注册新用户和租户
exports.register = async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    // 检查邮箱是否已被使用
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 创建新租户
    const tenant = new Tenant({
      name: companyName,
      companyName: companyName,
      subscriptionPlan: 'basic',
      status: 'active'
    });

    await tenant.save();

    // 创建新用户
    const user = new User({
      tenantId: tenant._id,
      name,
      email,
      password,
      role: 'admin' // 注册的第一个用户是admin
    });

    await user.save();

    // 创建JWT令牌
    const token = jwt.sign(
      { id: user._id, email: user.email, tenantId: tenant._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: '注册成功',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        subscriptionPlan: tenant.subscriptionPlan
      },
      token
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email }).populate('tenantId');
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 检查租户状态
    if (user.tenantId.status !== 'active') {
      return res.status(403).json({ message: '租户已停用或暂停，请联系管理员' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 创建JWT令牌
    const token = jwt.sign(
      { id: user._id, email: user.email, tenantId: user.tenantId._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: '登录成功',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tenant: {
        id: user.tenantId._id,
        name: user.tenantId.name,
        subscriptionPlan: user.tenantId.subscriptionPlan
      },
      token
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 刷新令牌
exports.refreshToken = async (req, res) => {
  try {
    const { id, email, tenantId } = req.userData;

    // 创建新JWT令牌
    const token = jwt.sign(
      { id, email, tenantId },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ message: '令牌刷新成功', token });
  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};
