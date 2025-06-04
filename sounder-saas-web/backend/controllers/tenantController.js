const Tenant = require('../models/Tenant');

// 获取当前租户信息
exports.getCurrentTenant = async (req, res) => {
  try {
    res.status(200).json({
      tenant: {
        id: req.tenant._id,
        name: req.tenant.name,
        companyName: req.tenant.companyName,
        subscriptionPlan: req.tenant.subscriptionPlan,
        status: req.tenant.status,
        createdAt: req.tenant.createdAt
      }
    });
  } catch (error) {
    console.error('获取租户信息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新当前租户信息
exports.updateCurrentTenant = async (req, res) => {
  try {
    const { name, companyName } = req.body;
    
    const tenant = req.tenant;
    
    if (name) tenant.name = name;
    if (companyName) tenant.companyName = companyName;
    
    tenant.updatedAt = Date.now();
    await tenant.save();
    
    res.status(200).json({
      message: '租户信息更新成功',
      tenant: {
        id: tenant._id,
        name: tenant.name,
        companyName: tenant.companyName,
        subscriptionPlan: tenant.subscriptionPlan,
        status: tenant.status
      }
    });
  } catch (error) {
    console.error('更新租户信息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取可用的订阅计划
exports.getSubscriptionPlans = async (req, res) => {
  try {
    // 返回预定义的订阅计划
    const subscriptionPlans = [
      {
        id: 'basic',
        name: '基础版',
        price: 99,
        features: [
          '最多5个设备',
          '基本控制功能',
          '标准客户支持'
        ]
      },
      {
        id: 'standard',
        name: '标准版',
        price: 299,
        features: [
          '最多15个设备',
          '高级控制功能',
          '优先客户支持',
          '数据分析'
        ]
      },
      {
        id: 'premium',
        name: '高级版',
        price: 599,
        features: [
          '无限设备',
          '全部功能',
          '24/7专属支持',
          '高级数据分析',
          '自定义集成'
        ]
      }
    ];
    
    res.status(200).json({ subscriptionPlans });
  } catch (error) {
    console.error('获取订阅计划错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新订阅计划
exports.updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlan } = req.body;
    
    // 验证订阅计划
    const validPlans = ['basic', 'standard', 'premium'];
    if (!validPlans.includes(subscriptionPlan)) {
      return res.status(400).json({ message: '无效的订阅计划' });
    }
    
    const tenant = req.tenant;
    tenant.subscriptionPlan = subscriptionPlan;
    tenant.updatedAt = Date.now();
    
    await tenant.save();
    
    res.status(200).json({
      message: '订阅计划更新成功',
      tenant: {
        id: tenant._id,
        name: tenant.name,
        subscriptionPlan: tenant.subscriptionPlan
      }
    });
  } catch (error) {
    console.error('更新订阅计划错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};
