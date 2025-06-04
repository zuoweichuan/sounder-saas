// filepath: sounder-saas-web/frontend/src/pages/TestApi.js
import React, { useState, useEffect } from 'react';
import ApiService from '../utils/ApiService';

const TestApi = () => {
  const [message, setMessage] = useState('准备测试API...');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [devices, setDevices] = useState([]);
  
  const testLogin = async () => {
    try {
      setMessage('正在测试登录...');
      const api = ApiService.getInstance();
      const result = await api.login('test@example.com', 'password123');
      setMessage(`登录成功! Token: ${api.token.substring(0, 20)}...`);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      setError(`登录失败: ${err.message}`);
      return false;
    }
  };
  
  const testGetDevices = async () => {
    try {
      setMessage('正在获取设备列表...');
      const api = ApiService.getInstance();
      const data = await api.getDevices();
      setDevices(data.devices || []);
      setMessage('API测试完成!');
    } catch (err) {
      setError(`获取设备失败: ${err.message}`);
    }
  };
  
  useEffect(() => {
    testLogin().then(success => {
      if (success) testGetDevices();
    });
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>API测试页面</h1>
      
      <div style={{ margin: '20px 0', padding: '10px', background: '#f0f0f0' }}>
        <h3>状态信息:</h3>
        <p>{message}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      
      {isLoggedIn && (
        <div>
          <h3>登录状态: 已登录</h3>
          <button onClick={testGetDevices}>手动测试获取设备</button>
        </div>
      )}
      
      {devices.length > 0 && (
        <div>
          <h3>设备列表:</h3>
          <ul>
            {devices.map((device, index) => (
              <li key={device.id || index}>
                {device.name} - {device.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestApi;
