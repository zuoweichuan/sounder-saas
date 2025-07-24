#!/usr/bin/env python3
# filepath: mqtt_test_server.py

import paho.mqtt.client as mqtt
import time
import json
import random
from datetime import datetime
import threading

class LocalMQTTTestServer:
    def __init__(self, host='localhost', port=1883):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.host = host
        self.port = port
        
        # 主题配置
        self.command_topic = "sounder/commands"     # 接收前端命令
        self.response_topic = "sounder/responses"   # 发送响应给前端
        self.status_topic = "sounder/status"        # 发送状态信息
        self.alert_topic = "sounder/alerts"         # 发送警报信息
        
        # 模拟设备状态
        self.device_state = {
            "speaker_angle": {"x": 0, "y": 0},
            "target_count": 0,
            "danger_level": "low",
            "cameras": {
                "main": "online",
                "side": "online", 
                "rear": "offline"
            }
        }
        
        # 启动状态推送线程
        self.running = True
        
    def on_connect(self, client, userdata, flags, rc):
        print(f"连接结果码: {rc}")
        if rc == 0:
            print("✅ MQTT服务器连接成功")
            # 订阅命令主题
            client.subscribe(self.command_topic)
            print(f"📡 订阅主题: {self.command_topic}")
            
            # 发送连接确认
            self.send_response("SYSTEM:服务器已连接，准备接收命令")
        else:
            print(f"❌ 连接失败，错误码: {rc}")
    
    def on_disconnect(self, client, userdata, rc):
        print(f"🔌 连接断开，错误码: {rc}")
    
    def on_message(self, client, userdata, msg):
        message = msg.payload.decode()
        topic = msg.topic
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        print(f"\n📨 [{timestamp}] 收到消息:")
        print(f"   主题: {topic}")
        print(f"   内容: {message}")
        
        # 处理不同类型的命令
        response = self.process_command(message)
        
        # 发送响应
        if response:
            self.send_response(response)
    
    def process_command(self, command):
        """处理接收到的命令"""
        try:
            if command.startswith('X:'):
                # X轴角度控制
                angle = float(command.split(':')[1])
                self.device_state["speaker_angle"]["x"] += angle
                return f"SUCCESS:X轴角度已调整 {angle}°，当前角度: {self.device_state['speaker_angle']['x']}°"
                
            elif command.startswith('Y:'):
                # Y轴角度控制
                angle = float(command.split(':')[1])
                self.device_state["speaker_angle"]["y"] += angle
                return f"SUCCESS:Y轴角度已调整 {angle}°，当前角度: {self.device_state['speaker_angle']['y']}°"
                
            elif command.startswith('I:'):
                # 身份查询
                id_number = command.split(':')[1]
                # 模拟不同的查询结果
                if id_number == "123456789012345678":
                    return f"IDENTITY:张三,员工,技术部经理"
                elif id_number == "987654321098765432":
                    return f"IDENTITY:李四,访客,VIP客户"
                else:
                    return f"IDENTITY:未知人员,陌生人,需要关注"
                
            elif command.startswith('TEST:'):
                # 测试命令
                test_data = command.split(':', 1)[1]
                return f"TEST_RESPONSE:收到测试数据 '{test_data}' - 时间: {datetime.now().strftime('%H:%M:%S')}"
                
            elif command.startswith('STATUS:'):
                # 状态查询
                return f"STATUS:{json.dumps(self.device_state, ensure_ascii=False)}"
                
            elif command.startswith('RESET:'):
                # 重置设备
                self.device_state["speaker_angle"] = {"x": 0, "y": 0}
                return "SUCCESS:设备已重置到初始位置"
                
            elif command.startswith('CAMERA:'):
                # 摄像头控制
                parts = command.split(':')
                if len(parts) >= 3:
                    camera_id = parts[1]
                    action = parts[2]
                    if camera_id in self.device_state["cameras"]:
                        self.device_state["cameras"][camera_id] = action
                        return f"SUCCESS:摄像头 {camera_id} 状态设置为 {action}"
                return "ERROR:摄像头控制命令格式错误"
                
            else:
                return f"ERROR:未知命令格式: {command}"
                
        except Exception as e:
            return f"ERROR:命令处理异常: {str(e)}"
    
    def send_response(self, response):
        """发送响应消息"""
        try:
            self.client.publish(self.response_topic, response)
            print(f"📤 发送响应: {response}")
        except Exception as e:
            print(f"❌ 发送响应失败: {e}")
    
    def send_status_update(self):
        """定期发送状态更新"""
        try:
            status_msg = f"STATUS_UPDATE:{json.dumps(self.device_state, ensure_ascii=False)}"
            self.client.publish(self.status_topic, status_msg)
            print(f"📊 状态更新: {self.device_state}")
        except Exception as e:
            print(f"❌ 发送状态失败: {e}")
    
    def send_random_alert(self):
        """随机发送警报"""
        alerts = [
            {"type": "入侵检测", "level": "medium", "location": "入口处"},
            {"type": "可疑行为", "level": "low", "location": "区域A"},
            {"type": "设备异常", "level": "high", "location": "后方监控"},
            {"type": "人员聚集", "level": "medium", "location": "中央区域"}
        ]
        
        alert = random.choice(alerts)
        alert["timestamp"] = datetime.now().isoformat()
        
        try:
            alert_msg = f"ALERT:{json.dumps(alert, ensure_ascii=False)}"
            self.client.publish(self.alert_topic, alert_msg)
            print(f"🚨 发送警报: {alert}")
        except Exception as e:
            print(f"❌ 发送警报失败: {e}")
    
    def status_loop(self):
        """状态推送循环"""
        counter = 0
        while self.running:
            time.sleep(10)  # 每10秒发送一次状态
            if self.running:
                self.send_status_update()
                counter += 1
                
                # 每30秒随机发送一次警报
                if counter % 3 == 0:
                    if random.random() < 0.5:  # 50%概率发送警报
                        self.send_random_alert()
    
    def start(self):
        """启动MQTT客户端"""
        try:
            print(f"🚀 正在连接到 MQTT Broker: {self.host}:{self.port}")
            self.client.connect(self.host, self.port, 60)
            
            # 启动状态推送线程
            status_thread = threading.Thread(target=self.status_loop)
            status_thread.daemon = True
            status_thread.start()
            
            print("📡 MQTT测试服务器已启动，等待消息...")
            print("🎯 主题配置:")
            print(f"   📥 接收命令: {self.command_topic}")
            print(f"   📤 发送响应: {self.response_topic}")
            print(f"   📊 状态推送: {self.status_topic}")
            print(f"   🚨 警报推送: {self.alert_topic}")
            print("\n💡 测试提示:")
            print("   - 发送 'TEST:hello' 进行基本测试")
            print("   - 发送 'X:15' 控制X轴角度")
            print("   - 发送 'I:123456789012345678' 进行身份查询")
            print("   - 发送 'STATUS:REQUEST' 获取设备状态")
            print("   - 按 Ctrl+C 退出\n")
            
            self.client.loop_forever()
            
        except KeyboardInterrupt:
            print("\n🛑 收到退出信号...")
            self.stop()
        except Exception as e:
            print(f"❌ 启动失败: {e}")
    
    def stop(self):
        """停止服务"""
        self.running = False
        if self.client:
            self.client.disconnect()
            print("👋 MQTT测试服务器已停止")

if __name__ == "__main__":
    print("=" * 50)
    print("🎯 本地MQTT测试服务器")
    print("=" * 50)
    
    server = LocalMQTTTestServer()
    server.start()
