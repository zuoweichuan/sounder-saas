const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 注册新用户
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 刷新令牌
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
