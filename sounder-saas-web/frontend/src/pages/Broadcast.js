import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, CircularProgress,
  Alert, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const Broadcast = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [buttonText, setButtonText] = useState('开始录音');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 开始录音
  const startRecording = async () => {
    try {
      setLoading(true);
      setButtonText('停止录音');
      setIsRecording(true);
      
      await sendRequest('lumos');
      setLoading(false);
    } catch (err) {
      console.error('开始录音失败:', err);
      setError('开始录音失败');
      setLoading(false);
    }
  };
  
  // 停止录音
  const stopRecording = async () => {
    try {
      setLoading(true);
      setButtonText('开始录音');
      setIsRecording(false);
      
      await sendRequest('stop');
      setLoading(false);
    } catch (err) {
      console.error('停止录音失败:', err);
      setError('停止录音失败');
      setLoading(false);
    }
  };
  
  // 发送HTTP请求（与原应用相同）
  const sendRequest = async (action) => {
    const url = `http://10.51.4.233:8000/${action}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      
      // 请求成功
      console.log(`${action}请求成功`);
    } catch (err) {
      console.error('请求失败:', err);
      throw err;
    }
  };
  
  // 处理录音按钮点击
  const handleRecordingToggle = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      await stopRecording();
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/first')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            喊话
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button 
            variant="contained"
            color={isRecording ? "error" : "primary"}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={handleRecordingToggle}
            disabled={loading}
            sx={{ 
              width: 150, 
              height: 150, 
              borderRadius: '50%',
              mb: 3
            }}
          >
            {loading ? <CircularProgress color="inherit" /> : 
             isRecording ? '停止录音' : '开始录音'}
          </Button>
          
          <Typography variant="h6">
            {buttonText}
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
            点击按钮开始录音广播，再次点击停止录音。<br />
            录音过程中，请对着麦克风清晰讲话。
          </Typography>
        </Paper>
        
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

export default Broadcast;
