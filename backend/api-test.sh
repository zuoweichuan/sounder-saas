#!/bin/bash

# SaaS API 测试脚本 (无jq版本)
BASE_URL="http://localhost:5000"
TOKEN=""

echo "===== SounderSaaS API 测试 ====="

# 测试基础路由
echo -e "\n1. 测试基础路由"
curl -s $BASE_URL/

# 测试登录
echo -e "\n2. 测试用户登录"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  $BASE_URL/api/auth/login)

echo $LOGIN_RESPONSE

# 提取token (使用grep和cut替代jq)
# 格式可能会有所不同，这里假设token在双引号内
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d':' -f2 | tr -d '"')
echo "获取的Token: ${TOKEN:0:15}..."

if [ -z "$TOKEN" ]; then
  echo "错误: 无法获取认证令牌，后续测试将失败"
  exit 1
fi

# 测试获取设备列表
echo -e "\n3. 测试获取设备列表"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/api/devices

# 测试创建设备
echo -e "\n4. 测试创建设备"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"新音响设备","type":"speaker","location":"会议室A"}' \
  $BASE_URL/api/devices

# 测试设备控制
echo -e "\n5. 测试设备控制"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"adjustAngle","params":{"xAngle":15,"yAngle":30}}' \
  $BASE_URL/api/devices/device1/control

# 测试喊话功能
echo -e "\n6. 测试喊话广播"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"broadcast","params":{"content":"这是一条测试广播信息"}}' \
  $BASE_URL/api/devices/device1/control

# 测试获取用户资料
echo -e "\n7. 测试获取用户资料"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/api/users/profile

echo -e "\n===== 测试完成 ====="
