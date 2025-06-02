const Device = require('../models/Device');

// 获取当前租户的所有设备
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find({ tenantId: req.tenant._id });
    
    res.status(200).json({
      devices: devices.map(device => ({
        id: device._id,
        name: device.name,
        type: device.type,
        location: device.location,
        status: device.status,
        xAngle: device.xAngle,
        yAngle: device.yAngle,
        lastActivity: device.lastActivity
      }))
    });
  } catch (error) {
    console.error('获取设备列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取单个设备
exports.getDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id,
      tenantId: req.tenant._id
    });
    
    if (!device) {
      return res.status(404).json({ message: '设备不存在或无权访问' });
    }
    
    res.status(200).json({
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        location: device.location,
        status: device.status,
        xAngle: device.xAngle,
        yAngle: device.yAngle,
        lastActivity: device.lastActivity
      }
    });
  } catch (error) {
    console.error('获取设备错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 创建新设备
exports.createDevice = async (req, res) => {
  try {
    const { name, type, location } = req.body;
    
    const device = new Device({
      tenantId: req.tenant._id,
      name,
      type,
      location,
      status: 'online',
      xAngle: 0,
      yAngle: 0
    });
    
    await device.save();
    
    res.status(201).json({
      message: '设备创建成功',
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        location: device.location,
        status: device.status,
        xAngle: device.xAngle,
        yAngle: device.yAngle
      }
    });
  } catch (error) {
    console.error('创建设备错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新设备
exports.updateDevice = async (req, res) => {
  try {
    const { name, type, location, status } = req.body;
    
    const device = await Device.findOne({
      _id: req.params.id,
      tenantId: req.tenant._id
    });
    
    if (!device) {
      return res.status(404).json({ message: '设备不存在或无权访问' });
    }
    
    if (name) device.name = name;
    if (type) device.type = type;
    if (location) device.location = location;
    if (status) device.status = status;
    
    device.updatedAt = Date.now();
    await device.save();
    
    res.status(200).json({
      message: '设备更新成功',
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        location: device.location,
        status: device.status,
        xAngle: device.xAngle,
        yAngle: device.yAngle
      }
    });
  } catch (error) {
    console.error('更新设备错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除设备
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenant._id
    });
    
    if (!device) {
      return res.status(404).json({ message: '设备不存在或无权访问' });
    }
    
    res.status(200).json({
      message: '设备删除成功',
      deviceId: req.params.id
    });
  } catch (error) {
    console.error('删除设备错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 控制设备
exports.controlDevice = async (req, res) => {
  try {
    const { action, params } = req.body;
    
    const device = await Device.findOne({
      _id: req.params.id,
      tenantId: req.tenant._id
    });
    
    if (!device) {
      return res.status(404).json({ message: '设备不存在或无权访问' });
    }
    
    // 检查设备状态
    if (device.status !== 'online') {
      return res.status(400).json({ message: `设备当前状态为${device.status}，无法执行操作` });
    }
    
    let result;
    switch (action) {
      case 'adjustAngle':
        // 更新设备角度
        if (params.xAngle !== undefined) device.xAngle = params.xAngle;
        if (params.yAngle !== undefined) device.yAngle = params.yAngle;
        await device.save();
        
        result = {
          success: true,
          message: '角度调整成功',
          xAngle: device.xAngle,
          yAngle: device.yAngle
        };
        break;
      case 'broadcast':
        // 模拟广播操作
        result = {
          success: true,
          message: '喊话广播发送成功',
          content: params.content || ''
        };
        
        // 记录设备活动
        device.lastActivity = Date.now();
        await device.save();
        break;
      default:
        return res.status(400).json({ message: '不支持的操作类型' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('控制设备错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};
