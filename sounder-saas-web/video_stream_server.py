#!/usr/bin/env python3

import cv2
import numpy as np
from flask import Flask, Response, render_template_string
import threading
import time
from datetime import datetime
import argparse

app = Flask(__name__)

class VideoStreamServer:
    def __init__(self, port=12346):
        self.port = port
        self.frame = None
        self.running = False
        
    def generate_test_frame(self):
        """生成测试视频帧"""
        # 创建640x480的图像
        img = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # 背景渐变
        for i in range(480):
            img[i, :] = [int(i/2), 50, int(255-i/2)]
        
        # 当前时间
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 添加文字信息
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(img, f"Video Stream Test", (50, 50), font, 1, (255, 255, 255), 2)
        cv2.putText(img, f"Port: {self.port}", (50, 100), font, 0.8, (255, 255, 255), 2)
        cv2.putText(img, timestamp, (50, 150), font, 0.7, (255, 255, 255), 2)
        
        # 添加移动的圆点（模拟活动）
        t = time.time()
        x = int(320 + 200 * np.sin(t))
        y = int(240 + 100 * np.cos(t))
        cv2.circle(img, (x, y), 20, (0, 255, 0), -1)
        
        # 添加边框
        cv2.rectangle(img, (10, 10), (630, 470), (255, 255, 255), 2)
        
        # 添加摄像头信息
        camera_info = f"Camera: Main Monitor"
        cv2.putText(img, camera_info, (50, 200), font, 0.6, (0, 255, 255), 2)
        
        return img
    
    def generate_frames(self):
        """生成视频帧"""
        while self.running:
            frame = self.generate_test_frame()
            
            # 编码为JPEG
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if ret:
                self.frame = buffer.tobytes()
            
            time.sleep(1/30)  # 30 FPS
    
    def get_frame(self):
        """获取当前帧"""
        return self.frame
    
    def start(self):
        """启动视频生成"""
        self.running = True
        self.frame_thread = threading.Thread(target=self.generate_frames)
        self.frame_thread.daemon = True
        self.frame_thread.start()
    
    def stop(self):
        """停止视频生成"""
        self.running = False

# 创建多个视频流实例
video_servers = {
    12346: VideoStreamServer(12346),  # 主监控
    12347: VideoStreamServer(12347),  # 侧面监控
    12348: VideoStreamServer(12348),  # 后方监控
}

def generate_video_feed(port):
    """视频流生成器"""
    server = video_servers.get(port)
    if not server:
        return
        
    while True:
        frame = server.get_frame()
        if frame:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(1/30)

@app.route('/video_feed')
def video_feed():
    """视频流路由"""
    port = int(request.environ.get('SERVER_PORT', 12346))
    return Response(generate_video_feed(port),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    """测试页面"""
    port = int(request.environ.get('SERVER_PORT', 12346))
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>视频流测试 - 端口 {port}</title>
        <style>
            body {{ font-family: Arial, sans-serif; text-align: center; padding: 20px; }}
            .video-container {{ margin: 20px auto; }}
            img {{ border: 2px solid #333; border-radius: 8px; }}
        </style>
    </head>
    <body>
        <h1>视频流测试服务器</h1>
        <h2>端口: {port}</h2>
        <div class="video-container">
            <img src="/video_feed" width="640" height="480">
        </div>
        <p>视频流URL: <code>http://localhost:{port}/video_feed</code></p>
    </body>
    </html>
    """
    return html

def run_server(port):
    """运行单个服务器"""
    try:
        print(f"🎥 启动视频流服务器 - 端口 {port}")
        server = video_servers[port]
        server.start()
        
        from werkzeug.serving import make_server
        http_server = make_server('0.0.0.0', port, app)
        http_server.serve_forever()
    except Exception as e:
        print(f"❌ 端口 {port} 启动失败: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='视频流测试服务器')
    parser.add_argument('--port', type=int, default=12346, help='服务器端口')
    parser.add_argument('--all', action='store_true', help='启动所有端口的服务器')
    
    args = parser.parse_args()
    
    if args.all:
        print("🚀 启动所有视频流服务器...")
        
        # 启动所有服务器
        threads = []
        for port in [12346, 12347, 12348]:
            thread = threading.Thread(target=run_server, args=(port,))
            thread.daemon = True
            thread.start()
            threads.append(thread)
            time.sleep(1)  # 避免端口冲突
        
        print("📡 所有视频流服务器已启动:")
        print("   🎥 主监控: http://localhost:12346/video_feed")
        print("   🎥 侧面监控: http://localhost:12347/video_feed")
        print("   🎥 后方监控: http://localhost:12348/video_feed")
        print("\n💡 测试提示:")
        print("   - 在浏览器中访问 http://localhost:12346 查看测试页面")
        print("   - 前端应用将自动连接这些视频流")
        print("   - 按 Ctrl+C 退出所有服务器\n")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 正在关闭所有视频流服务器...")
            for server in video_servers.values():
                server.stop()
            print("👋 所有服务器已停止")
    else:
        run_server(args.port)
