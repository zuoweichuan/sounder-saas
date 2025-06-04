import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, Grid,
  CircularProgress, Alert, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MQTTService from '../utils/MQTTService';

const Control = () => {
  const navigate = useNavigate();
  const mqttService = MQTTService.getInstance();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 角度控制状态
  const [xAngle, setXAngle] = useState(0);
  const [yAngle, setYAngle] = useState(0);
  
  useEffect(() => {
    // 连接MQTT服务
    const connectMqtt = async () => {
      try {
        setLoading(true);
        await mqttService.connect();
        
        // 添加MQTT消息处理函数
        mqttService.addMessageHandler('control', (message) => {
          // 解析来自MQTT的消息
          const parts = message.split(':');
          if (parts.length >= 3) {
            if (parts[3] === '1') {
              // 更新角度信息
              setXAngle(Math.round(Number(parts[4])));
              setYAngle(Math.round(Number(parts[5])));
            }
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('MQTT连接失败:', err);
        setError('MQTT连接失败，控制功能不可用');
        setLoading(false);
      }
    };
    
    connectMqtt();
    
    return () => {
      // 清理
      mqttService.removeMessageHandler('control');
    };
  }, []);
  
  // 角度调整函数
  const adjustXAngle = (change) => {
    const newAngle = xAngle + change;
    if (newAngle >= -90 && newAngle <= 90) {
      setXAngle(newAngle);
      // 发送MQTT消息
      mqttService.pushMessage1(`X:${change > 0 ? '13.333' : '-13.333'}`).catch(err => {
        console.error('发送MQTT消息失败:', err);
        setError('调整角度失败，请检查连接');
      });
      showToast(`X轴角度已调整为 ${newAngle}°`);
    }
  };
  
  const adjustYAngle = (change) => {
    const newAngle = yAngle + change;
    if (newAngle >= -90 && newAngle <= 90) {
      setYAngle(newAngle);
      // 发送MQTT消息
      mqttService.pushMessage1(`Y:${change > 0 ? '14.2857' : '-14.2857'}`).catch(err => {
        console.error('发送MQTT消息失败:', err);
        setError('调整角度失败，请检查连接');
      });
      showToast(`Y轴角度已调整为 ${newAngle}°`);
    }
  };
  
  // 显示提示 (模拟原应用的toast)
  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '1000';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 1500);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            控制音响
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            手动控制模式
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" gutterBottom>Y轴角度控制</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4 }}>
                    <Button 
                      variant="contained" 
                      onClick={() => adjustYAngle(5)}
                      sx={{ minWidth: '60px', height: '60px', borderRadius: '50%', mb: 2 }}
                    >
                      上
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => adjustYAngle(-5)}
                      sx={{ minWidth: '60px', height: '60px', borderRadius: '50%' }}
                    >
                      下
                    </Button>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', width: '80px' }}>
                    <Typography variant="h4">{yAngle}°</Typography>
                    <Typography variant="body2">当前Y轴角度</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>X轴角度控制</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={() => adjustXAngle(-5)}
                    sx={{ minWidth: '60px', height: '60px', borderRadius: '50%', mr: 2 }}
                  >
                    左
                  </Button>
                  
                  <Box sx={{ textAlign: 'center', width: '80px' }}>
                    <Typography variant="h4">{xAngle}°</Typography>
                    <Typography variant="body2">当前X轴角度</Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    onClick={() => adjustXAngle(5)}
                    sx={{ minWidth: '60px', height: '60px', borderRadius: '50%', ml: 2 }}
                  >
                    右
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" onClick={() => navigate('/first')} sx={{ mr: 2 }}>
            返回服务页
          </Button>
          <Button variant="contained" onClick={() => navigate('/')} color="secondary">
            返回首页
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Control;
