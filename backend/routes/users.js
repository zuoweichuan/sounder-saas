const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// 获取当前用户信息
router.get('/profile', authMiddleware, userController.getProfile);

// 更新用户信息
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
