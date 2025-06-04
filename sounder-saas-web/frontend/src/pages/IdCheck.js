import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, TextField, Grid,
  CircularProgress, Alert, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MQTTService from '../utils/MQTTService';

const IdCheck = () => {
  const navigate = useNavigate();
  const mqttService = MQTTService.getInstance();
  
  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receiveMsg, setReceiveMsg] = useState('');
  const [result, setResult] = useState([]);
  
  // 视频流相关状态
  const [videoUrl, setVideoUrl] = useState("http://192.168.137.100:12346/video_feed");
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    // 连接MQTT服务
    const connectMqtt = async () => {
      try {
        await mqttService.connect();
        
        // 添加MQTT消息处理
        mqttService.addMessageHandler('idCheck', (message) => {
          setReceiveMsg(message);
          
          // 解析消息
          const parts = message.split(':');
          if (parts.length > 0) {
            setResult(parts);
          }
          
          setVideoLoading(false);
        });
      } catch (err) {
        console.error('MQTT连接失败:', err);
        setError('MQTT连接失败，查询功能不可用');
      }
    };
    
    connectMqtt();
    
    return () => {
      // 清理
      mqttService.removeMessageHandler('idCheck');
    };
  }, []);
  
  const handleSearch = async () => {
    if (!idNumber.trim()) {
      setError('请输入身份证号码');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setVideoLoading(true);
      setVideoError(false);
      
      // 发送MQTT查询命令
      await mqttService.pushMessage1(`I:${idNumber}`);
      console.log('发送查询请求:', idNumber);
      
      // 延时关闭loading状态，模拟原应用行为
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('查询失败:', err);
      setError(`查询失败: ${err.message}`);
      setLoading(false);
      setVideoLoading(false);
      setVideoError(true);
    }
  };
  
  const refreshVideo = () => {
    setVideoLoading(true);
    setVideoError(false);
    setVideoUrl(`http://192.168.137.100:12346/video_feed?t=${Date.now()}`);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/first')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            身份证号码查询
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="身份证号码"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="请填写需要查询的身份证号码"
                  sx={{ mr: 2 }}
                  disabled={loading}
                />
                <Button 
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading || !idNumber.trim()}
                >
                  {loading ? <CircularProgress size={24} /> : '查询'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                实时视频
              </Typography>
              
              <Box sx={{ 
                position: 'relative', 
                width: '100%', 
                height: 480, 
                bgcolor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {videoLoading && (
                  <CircularProgress sx={{ position: 'absolute', zIndex: 1 }} />
                )}
                
                {videoError ? (
                  <Typography color="error">
                    无法加载视频流，请检查连接
                  </Typography>
                ) : (
                  <iframe 
                    src={videoUrl}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: videoLoading ? 'none' : 'block'
                    }}
                    onLoad={() => setVideoLoading(false)}
                    onError={() => {
                      setVideoLoading(false);
                      setVideoError(true);
                    }}
                    title="身份证视频流"
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={refreshVideo}
                >
                  刷新视频
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                查询结果
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                value={receiveMsg || '等待查询结果...'}
                disabled
              />
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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

export default IdCheck;
