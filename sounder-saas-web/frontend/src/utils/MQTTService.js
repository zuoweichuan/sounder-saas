import mqtt from 'mqtt';

class MQTTService {
  static instance = null;
  
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.messageHandlers = {};
    
    // 本地MQTT配置
    this.config = {
      url: 'ws://localhost:9001',
      clientId: `sounder_client_${Math.random().toString(16).substr(2, 8)}`,
      userName: '',
      password: '',
      topic1: 'sounder/commands',   // 发送通道
      topic2: 'sounder/responses',  // 接收通道
      qos: 1
    };
  }
  
  static getInstance() {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }
    return MQTTService.instance;
  }
  
  connect() {
    if (this.client) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(this.config.url, {
        clientId: this.config.clientId,
        username: this.config.userName,
        password: this.config.password,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000
      });
      
      this.client.on('connect', () => {
        console.log('MQTT连接成功');
        this.isConnected = true;
        
        // 订阅接收通道
        this.client.subscribe(this.config.topic2, { qos: this.config.qos }, (err) => {
          if (err) {
            console.error('MQTT订阅失败:', err);
            reject(err);
          } else {
            console.log('MQTT订阅成功');
            resolve();
          }
        });
      });
      
      this.client.on('message', (topic, message) => {
        const messageStr = message.toString();
        console.log(`接收到MQTT消息: ${topic} - ${messageStr}`);
        
        // 转发消息给已注册的处理函数
        Object.values(this.messageHandlers).forEach(handler => {
          try {
            handler(messageStr);
          } catch (err) {
            console.error('处理MQTT消息时出错:', err);
          }
        });
      });
      
      this.client.on('error', (err) => {
        console.error('MQTT错误:', err);
        this.isConnected = false;
        reject(err);
      });
      
      this.client.on('close', () => {
        console.log('MQTT连接关闭');
        this.isConnected = false;
      });
    });
  }
  
  disconnect() {
    if (this.client && this.isConnected) {
      this.client.end();
      this.client = null;
      this.isConnected = false;
    }
  }
  
  pushMessage(message) {
    if (!this.client || !this.isConnected) {
      return Promise.reject(new Error('MQTT未连接'));
    }
    
    return new Promise((resolve, reject) => {
      this.client.publish(this.config.topic1, message, { qos: this.config.qos }, (err) => {
        if (err) {
          console.error('发送MQTT消息失败:', err);
          reject(err);
        } else {
          console.log(`发送MQTT消息成功: ${message}`);
          resolve();
        }
      });
    });
  }
  
  // 原应用中的pushMessage1别名方法
  pushMessage1(message) {
    return this.pushMessage(message);
  }
  
  // 添加消息处理函数
  addMessageHandler(id, handler) {
    this.messageHandlers[id] = handler;
  }
  
  // 移除消息处理函数
  removeMessageHandler(id) {
    delete this.messageHandlers[id];
  }
}

export default MQTTService;
