import mqtt from 'mqtt';

class MQTTService {
  static instance = null;
  
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.messageHandlers = {};
    
    // 与原应用相同的MQTT配置
    this.config = {
      url: 'mqtt://cb27b984ca.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883', 
      clientId: '67cfb54724d772325524bd92_sounder0_0_0_2025031114',
      userName: '67cfb54724d772325524bd92_sounder0',
      password: 'fa186b2c9e17abc682f2aea8d97191fe468bb1e4850b99357f7b2ccd4441d529',
      topic1: '/test/M2M/01',  // 发送通道
      topic2: '/test/M2M/02',  // 接收通道
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
        password: this.config.password
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
