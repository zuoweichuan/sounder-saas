#!/bin/bash

# SaaS多租户API测试脚本
BASE_URL="http://localhost:5000/api"
TOKEN=""
TENANT_ID=""
DEVICE_ID=""

echo "===== SounderSaaS 多租户API测试 ====="

# 1. 测试租户注册
echo -e "\n1. 测试租户注册"
REGISTER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "email": "test@example.com",
    "password": "password123",
    "companyName": "测试企业"
  }' \
  $BASE_URL/auth/register)

echo "$REGISTER_RESPONSE"

# 提取token和租户ID
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d':' -f2 | tr -d '"')
TENANT_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d':' -f2 | tr -d '"')

echo "获取的Token: ${TOKEN:0:15}..."
echo "租户ID: $TENANT_ID"

if [ -z "$TOKEN" ]; then
  echo "错误: 无法获取认证令牌，后续测试将失败"
  exit 1
fi

# 2. 测试获取租户信息
echo -e "\n2. 测试获取租户信息"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/tenants/current

# 3. 测试创建设备
echo -e "\n3. 测试创建设备"
DEVICE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "测试音响",
    "type": "speaker",
    "location": "会议室A"
  }' \
  $BASE_URL/devices)

echo "$DEVICE_RESPONSE"

# 提取设备ID
DEVICE_ID=$(echo $DEVICE_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d':' -f2 | tr -d '"')
echo "设备ID: $DEVICE_ID"

# 4. 测试获取设备列表(应该只显示当前租户的设备)
echo -e "\n4. 测试获取设备列表"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/devices

# 5. 测试控制设备
echo -e "\n5. 测试设备控制"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "action": "adjustAngle",
    "params": {
      "xAngle": 15,
      "yAngle": 30
    }
  }' \
  $BASE_URL/devices/$DEVICE_ID/control

# 6. 创建第二个租户
echo -e "\n6. 创建第二个租户"
REGISTER_RESPONSE2=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户2",
    "email": "test2@example.com",
    "password": "password123",
    "companyName": "测试企业2"
  }' \
  $BASE_URL/auth/register)

echo "$REGISTER_RESPONSE2"

# 提取第二个租户的token
TOKEN2=$(echo $REGISTER_RESPONSE2 | grep -o '"token":"[^"]*"' | cut -d':' -f2 | tr -d '"')
echo "第二个租户的Token: ${TOKEN2:0:15}..."

# 7. 测试第二个租户获取设备列表(应该为空)
echo -e "\n7. 测试第二个租户获取设备列表"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN2" \
  $BASE_URL/devices

# 8. 测试订阅计划
echo -e "\n8. 测试获取订阅计划"
curl -s -X GET \
  $BASE_URL/tenants/subscription-plans

# 9. 测试更新订阅计划
echo -e "\n9. 测试更新订阅计划"
curl -s -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "subscriptionPlan": "standard"
  }' \
  $BASE_URL/tenants/subscription

echo -e "\n===== 测试完成 ====="
