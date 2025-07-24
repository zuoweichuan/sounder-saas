// 视频流配置
export const VIDEO_CONFIG = {
  // 视频流URL配置
  STREAMS: {
    main: {
      id: 'main',
      name: '主监控',
      url: 'http://localhost:12346/video_feed',
      position: '入口处',
      defaultStatus: 'loading'
    },
    side: {
      id: 'side', 
      name: '侧面监控',
      url: 'http://localhost:12347/video_feed',
      position: '左侧区域',
      defaultStatus: 'loading'
    },
    rear: {
      id: 'rear',
      name: '后方监控', 
      url: 'http://localhost:12348/video_feed',
      position: '后方区域',
      defaultStatus: 'offline'
    }
  },
  
  // 视频配置
  OPTIONS: {
    autoplay: true,
    controls: false,
    muted: true,
    playsInline: true
  },
  
  // 错误重试配置
  RETRY: {
    maxAttempts: 3,
    interval: 2000 // 2秒
  }
};
