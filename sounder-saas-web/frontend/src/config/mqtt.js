// MQTT配置文件
export const MQTT_CONFIG = {
  // 本地MQTT服务器配置
  BROKER_URL: 'ws://localhost:9001',
  
  // 主题配置
  TOPICS: {
    COMMANDS: 'sounder/commands',    // 发送命令
    RESPONSES: 'sounder/responses', // 接收响应
    STATUS: 'sounder/status',       // 状态信息
    ALERTS: 'sounder/alerts',       // 警报信息
  },
  
  // 连接选项
  OPTIONS: {
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    keepalive: 60,
  }
};
