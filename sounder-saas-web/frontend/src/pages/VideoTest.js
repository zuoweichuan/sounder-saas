import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, Grid, Alert,
  IconButton, Card, CardContent, Chip, CircularProgress, Switch,
  FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const VideoTest = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [error, setError] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState('camera');
  
  // 模拟的外部视频流配置
  const [mockStreams] = useState([
    {
      id: 'test1',
      name: '测试视频流1',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
      position: '测试区域1',
      type: 'external'
    },
    {
      id: 'test2', 
      name: '测试视频流2',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      position: '测试区域2',
      type: 'external'
    }
  ]);

  const [streamStatuses, setStreamStatuses] = useState({});

  useEffect(() => {
    // 初始化流状态
    const initialStatuses = {};
    mockStreams.forEach(stream => {
      initialStatuses[stream.id] = 'offline';
    });
    initialStatuses['camera'] = 'offline';
    setStreamStatuses(initialStatuses);

    return () => {
      // 清理摄像头流
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraLoading(true);
    setError('');
    
    try {
      // 请求摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // 前置摄像头
        },
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setCameraEnabled(true);
      setStreamStatuses(prev => ({ ...prev, camera: 'online' }));
      setSelectedStream('camera');
      
    } catch (err) {
      console.error('摄像头启动失败:', err);
      let errorMsg = '摄像头启动失败';
      
      if (err.name === 'NotAllowedError') {
        errorMsg = '摄像头权限被拒绝，请在浏览器设置中允许访问摄像头';
      } else if (err.name === 'NotFoundError') {
        errorMsg = '未找到摄像头设备';
      } else if (err.name === 'NotReadableError') {
        errorMsg = '摄像头正被其他应用占用';
      }
      
      setError(errorMsg);
      setCameraEnabled(false);
      setStreamStatuses(prev => ({ ...prev, camera: 'error' }));
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraEnabled(false);
    setStreamStatuses(prev => ({ ...prev, camera: 'offline' }));
  };

  const handleCameraToggle = () => {
    if (cameraEnabled) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const testExternalStream = (streamId) => {
    const stream = mockStreams.find(s => s.id === streamId);
    if (!stream) return;

    setStreamStatuses(prev => ({ ...prev, [streamId]: 'loading' }));
    setSelectedStream(streamId);
    
    // 模拟加载时间
    setTimeout(() => {
      // 由于这些是公共测试视频，可能不总是可用
      setStreamStatuses(prev => ({ ...prev, [streamId]: 'online' }));
    }, 2000);
  };

  const openFullscreen = () => {
    if (selectedStream === 'camera' && videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const getCurrentStreamInfo = () => {
    if (selectedStream === 'camera') {
      return {
        name: '本地摄像头',
        position: '电脑摄像头',
        status: streamStatuses.camera || 'offline'
      };
    }
    
    const stream = mockStreams.find(s => s.id === selectedStream);
    return stream ? {
      name: stream.name,
      position: stream.position,
      status: streamStatuses[selectedStream] || 'offline'
    } : null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'loading': return 'info';
      case 'error': return 'error';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return '在线';
      case 'loading': return '连接中';
      case 'error': return '错误';
      case 'offline': return '离线';
      default: return '未知';
    }
  };

  const currentStream = getCurrentStreamInfo();

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/first')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            视频流测试
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* 摄像头控制面板 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              本地摄像头控制
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={cameraEnabled}
                  onChange={handleCameraToggle}
                  disabled={cameraLoading}
                />
              }
              label={cameraEnabled ? "摄像头已开启" : "摄像头已关闭"}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            开启摄像头后可以看到实时视频画面。首次使用需要授权浏览器访问摄像头。
          </Typography>
          
          {cameraLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2">正在启动摄像头...</Typography>
            </Box>
          )}
        </Paper>

        {/* 主视频显示 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {currentStream?.name} - {currentStream?.position}
            </Typography>
            <Box>
              <IconButton 
                onClick={() => {
                  if (selectedStream === 'camera') {
                    handleCameraToggle();
                  } else {
                    testExternalStream(selectedStream);
                  }
                }}
                disabled={cameraLoading}
              >
                <RefreshIcon />
              </IconButton>
              <IconButton 
                onClick={openFullscreen}
                disabled={currentStream?.status !== 'online'}
              >
                <FullscreenIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            height: 400, 
            bgcolor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 1,
            border: '1px solid #ddd'
          }}>
            {selectedStream === 'camera' ? (
              <>
                {cameraLoading && (
                  <Box sx={{ position: 'absolute', zIndex: 2, textAlign: 'center' }}>
                    <CircularProgress sx={{ color: 'white', mb: 2 }} />
                    <Typography color="white">启动摄像头中...</Typography>
                  </Box>
                )}
                
                {!cameraEnabled && !cameraLoading && (
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <CameraAltIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      摄像头未开启
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      请开启摄像头开关查看实时画面
                    </Typography>
                  </Box>
                )}
                
                <video 
                  ref={videoRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: cameraEnabled && !cameraLoading ? 'block' : 'none'
                  }}
                  autoPlay
                  playsInline
                  muted
                />
              </>
            ) : (
              // 外部视频流显示
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <VideocamIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  测试视频流
                </Typography>
                <Typography variant="body2">
                  {streamStatuses[selectedStream] === 'loading' ? '加载中...' : '外部视频流测试'}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              类型: {selectedStream === 'camera' ? '本地摄像头' : '外部视频流'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              状态: {getStatusText(currentStream?.status)}
            </Typography>
          </Box>
        </Paper>

        {/* 视频源选择 */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            视频源选择
          </Typography>
          
          <Grid container spacing={2}>
            {/* 本地摄像头卡片 */}
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedStream === 'camera' ? '2px solid' : '1px solid transparent',
                  borderColor: selectedStream === 'camera' ? 'primary.main' : 'transparent',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => setSelectedStream('camera')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CameraAltIcon sx={{ mr: 1, color: cameraEnabled ? 'success.main' : 'grey.500' }} />
                    <Typography variant="h6">本地摄像头</Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    电脑内置摄像头
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={getStatusText(streamStatuses.camera)}
                      color={getStatusColor(streamStatuses.camera)}
                      size="small"
                    />
                    
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCameraToggle();
                      }}
                      disabled={cameraLoading}
                    >
                      {cameraEnabled ? '关闭' : '开启'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 外部视频流卡片 */}
            {mockStreams.map((stream) => (
              <Grid item xs={12} md={4} key={stream.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedStream === stream.id ? '2px solid' : '1px solid transparent',
                    borderColor: selectedStream === stream.id ? 'primary.main' : 'transparent',
                    '&:hover': { boxShadow: 4 },
                    opacity: streamStatuses[stream.id] === 'offline' ? 0.6 : 1
                  }}
                  onClick={() => setSelectedStream(stream.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {streamStatuses[stream.id] === 'online' ? 
                        <VideocamIcon sx={{ mr: 1, color: 'success.main' }} /> :
                        <VideocamOffIcon sx={{ mr: 1, color: 'grey.500' }} />
                      }
                      <Typography variant="h6">{stream.name}</Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stream.position}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={getStatusText(streamStatuses[stream.id])}
                        color={getStatusColor(streamStatuses[stream.id])}
                        size="small"
                      />
                      
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          testExternalStream(stream.id);
                        }}
                        disabled={streamStatuses[stream.id] === 'loading'}
                      >
                        测试
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* 使用说明 */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            使用说明
          </Typography>
          
          <Typography variant="body2" component="div">
            <strong>本地摄像头测试：</strong>
            <ul>
              <li>点击摄像头开关或"开启"按钮启动摄像头</li>
              <li>首次使用需要在浏览器中授权摄像头访问权限</li>
              <li>支持全屏查看和实时视频显示</li>
            </ul>
            
            <strong>外部视频流测试：</strong>
            <ul>
              <li>点击"测试"按钮模拟连接外部视频流</li>
              <li>用于测试视频流加载状态和界面显示</li>
            </ul>
            
            <strong>注意事项：</strong>
            <ul>
              <li>确保浏览器支持摄像头访问（HTTPS环境或localhost）</li>
              <li>如果摄像头无法启动，请检查是否被其他应用占用</li>
              <li>点击全屏按钮可以全屏查看摄像头画面</li>
            </ul>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default VideoTest;
