class SystemStatusService {
  constructor() {
    this.listeners = [];
    this.status = {
      // 音响状态
      speaker: {
        position: { x: 0, y: 0, z: 1.5 },
        angle: { x: 0, y: 0 },
        status: 'online',
        lastUpdate: new Date()
      },
      // 环境状态
      environment: {
        surroundings: '室内环境',
        cameras: [
          { id: 1, name: '主摄像头', status: 'online', position: '入口处' },
          { id: 2, name: '侧摄像头', status: 'online', position: '左侧区域' },
          { id: 3, name: '后摄像头', status: 'offline', position: '后方区域' }
        ],
        dangerLevel: 'low', // low, medium, high, critical
        weather: '晴朗',
        lighting: '充足'
      },
      // 追踪目标
      targets: {
        count: 2,
        active: 1,
        identified: 1,
        unidentified: 1
      },
      // 危险检测
      dangerDetection: {
        enabled: true,
        lastScan: new Date(),
        threats: [
          { type: '可疑行为', level: 'medium', location: '区域A', time: new Date() }
        ],
        alertCount: 1
      },
      // 视频流状态
      videoStreams: {
        main: {
          id: 'main',
          name: '主监控',
          url: 'http://192.168.137.100:12346/video_feed',
          status: 'online',
          quality: 'high',
          fps: 30
        },
        side: {
          id: 'side',
          name: '侧面监控',
          url: 'http://192.168.137.100:12347/video_feed',
          status: 'online',
          quality: 'medium',
          fps: 25
        },
        rear: {
          id: 'rear',
          name: '后方监控',
          url: 'http://192.168.137.100:12348/video_feed',
          status: 'offline',
          quality: 'low',
          fps: 0
        }
      }
    };
  }

  static getInstance() {
    if (!SystemStatusService.instance) {
      SystemStatusService.instance = new SystemStatusService();
    }
    return SystemStatusService.instance;
  }

  getStatus() {
    return this.status;
  }

  // 视频流相关方法
  updateVideoStreamStatus(streamId, status) {
    if (this.status.videoStreams[streamId]) {
      this.status.videoStreams[streamId].status = status;
      this.notifyListeners();
    }
  }

  updateVideoStreamQuality(streamId, quality, fps) {
    if (this.status.videoStreams[streamId]) {
      this.status.videoStreams[streamId].quality = quality;
      this.status.videoStreams[streamId].fps = fps;
      this.notifyListeners();
    }
  }

  getVideoStreams() {
    return this.status.videoStreams;
  }

  // 摄像头状态更新
  updateCameraStatus(cameraId, status) {
    const camera = this.status.environment.cameras.find(c => c.id === cameraId);
    if (camera) {
      camera.status = status;
      this.notifyListeners();
    }
  }

  updateSpeakerPosition(position) {
    this.status.speaker.position = position;
    this.status.speaker.lastUpdate = new Date();
    this.notifyListeners();
  }

  updateSpeakerAngle(angle) {
    this.status.speaker.angle = angle;
    this.status.speaker.lastUpdate = new Date();
    this.notifyListeners();
  }

  updateTargetCount(count) {
    this.status.targets.count = count;
    this.notifyListeners();
  }

  updateDangerLevel(level) {
    this.status.environment.dangerLevel = level;
    this.notifyListeners();
  }

  addThreat(threat) {
    this.status.dangerDetection.threats.push(threat);
    this.status.dangerDetection.alertCount++;
    this.notifyListeners();
  }

  clearThreats() {
    this.status.dangerDetection.threats = [];
    this.status.dangerDetection.alertCount = 0;
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  // 模拟实时数据更新
  startSimulation() {
    setInterval(() => {
      // 随机更新某些状态来模拟实时变化
      if (Math.random() < 0.1) { // 10% 概率更新目标数量
        this.updateTargetCount(Math.floor(Math.random() * 5));
      }
      
      if (Math.random() < 0.05) { // 5% 概率添加新威胁
        const threats = ['可疑行为', '入侵检测', '异常移动', '危险物品'];
        const levels = ['low', 'medium', 'high'];
        const locations = ['区域A', '区域B', '入口处', '后方'];
        
        this.addThreat({
          type: threats[Math.floor(Math.random() * threats.length)],
          level: levels[Math.floor(Math.random() * levels.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          time: new Date()
        });
      }
    }, 5000); // 每5秒检查一次
  }
}

export default SystemStatusService;
