const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// 获取当前租户信息
router.get('/current', authMiddleware, tenantController.getCurrentTenant);

// 更新当前租户信息
router.put('/current', authMiddleware, adminMiddleware, tenantController.updateCurrentTenant);

// 获取订阅计划
router.get('/subscription-plans', tenantController.getSubscriptionPlans);

// 更新订阅计划
router.put('/subscription', authMiddleware, adminMiddleware, tenantController.updateSubscription);

module.exports = router;
