const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middlewares/authMiddleware');

// 获取所有设备
router.get('/', authMiddleware, deviceController.getAllDevices);

// 获取单个设备
router.get('/:id', authMiddleware, deviceController.getDevice);

// 创建新设备
router.post('/', authMiddleware, deviceController.createDevice);

// 更新设备
router.put('/:id', authMiddleware, deviceController.updateDevice);

// 删除设备
router.delete('/:id', authMiddleware, deviceController.deleteDevice);

// 控制设备
router.post('/:id/control', authMiddleware, deviceController.controlDevice);

module.exports = router;
