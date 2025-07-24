import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, List, ListItem, ListItemText, ListItemIcon,
  IconButton, BottomNavigation, BottomNavigationAction, Chip, Grid, Button,
  CircularProgress, Alert, Card, CardContent, Tabs, Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SystemStatusService from '../utils/SystemStatusService';

const Second = () => {
  const navigate = useNavigate();
  const systemStatus = SystemStatusService.getInstance();
  const [navValue, setNavValue] = useState(2);
  const [status, setStatus] = useState(systemStatus.getStatus());
  const [tabValue, setTabValue] = useState(0);
  
  // 视频流相关状态
  const [videoStreams, setVideoStreams] = useState([
    {
      id: 'main',
      name: '主监控',
      url: 'http://192.168.137.100:12346/video_feed',
      status: 'loading',
      position: '入口处'
    },
    {
      id: 'side',
      name: '侧面监控',
      url: 'http://192.168.137.100:12347/video_feed',
      status: 'loading',
      position: '左侧区域'
    },
    {
      id: 'rear',
      name: '后方监控',
      url: 'http://192.168.137.100:12348/video_feed',
      status: 'offline',
      position: '后方区域'
    }
  ]);
  
  const [selectedStream, setSelectedStream] = useState('main');

  useEffect(() => {
    // 订阅系统状态更新
    const unsubscribe = systemStatus.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return unsubscribe;
  }, [systemStatus]);

  const getDangerLevelColor = (level) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const refreshVideoStream = (streamId) => {
    setVideoStreams(prev => prev.map(stream => 
      stream.id === streamId 
        ? { ...stream, status: 'loading', url: `${stream.url.split('?')[0]}?t=${Date.now()}` }
        : stream
    ));
  };

  const handleVideoLoad = (streamId) => {
    setVideoStreams(prev => prev.map(stream => 
      stream.id === streamId 
        ? { ...stream, status: 'online' }
        : stream
    ));
  };

  const handleVideoError = (streamId) => {
    setVideoStreams(prev => prev.map(stream => 
      stream.id === streamId 
        ? { ...stream, status: 'error' }
        : stream
    ));
  };

  const openFullscreen = (streamUrl) => {
    // 打开新窗口显示全屏视频
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>视频监控 - 全屏</title>
          <style>
            body { margin: 0; background: black; }
            iframe { width: 100vw; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${streamUrl}" title="全屏视频监控"></iframe>
        </body>
      </html>
    `);
  };

  const getCurrentStream = () => {
    return videoStreams.find(stream => stream.id === selectedStream);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            安全监控中心
          </Typography>
        </Box>

        {/* 标签页导航 */}
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label="实时监控" />
            <Tab label="威胁警报" />
            <Tab label="设备状态" />
          </Tabs>
        </Paper>

        {/* 实时监控标签页 */}
        {tabValue === 0 && (
          <>
            {/* 主视频流显示 */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {getCurrentStream()?.name} - {getCurrentStream()?.position}
                </Typography>
                <Box>
                  <IconButton 
                    onClick={() => refreshVideoStream(selectedStream)}
                    disabled={getCurrentStream()?.status === 'loading'}
                  >
                    <RefreshIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => openFullscreen(getCurrentStream()?.url)}
                    disabled={getCurrentStream()?.status !== 'online'}
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
                borderRadius: 1
              }}>
                {getCurrentStream()?.status === 'loading' && (
                  <Box sx={{ position: 'absolute', zIndex: 1, textAlign: 'center' }}>
                    <CircularProgress sx={{ color: 'white', mb: 2 }} />
                    <Typography color="white">加载视频流中...</Typography>
                  </Box>
                )}
                
                {getCurrentStream()?.status === 'error' ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography color="error" sx={{ mb: 2 }}>
                      无法加载视频流
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => refreshVideoStream(selectedStream)}
                    >
                      重试
                    </Button>
                  </Box>
                ) : getCurrentStream()?.status === 'offline' ? (
                  <Typography color="grey.500">
                    摄像头离线
                  </Typography>
                ) : (
                  <iframe 
                    src={getCurrentStream()?.url}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: getCurrentStream()?.status === 'loading' ? 'none' : 'block'
                    }}
                    onLoad={() => handleVideoLoad(selectedStream)}
                    onError={() => handleVideoError(selectedStream)}
                    title={`${getCurrentStream()?.name}视频流`}
                  />
                )}
              </Box>
            </Paper>

            {/* 视频流选择 */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                摄像头选择
              </Typography>
              <Grid container spacing={2}>
                {videoStreams.map((stream) => (
                  <Grid item xs={12} md={4} key={stream.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedStream === stream.id ? '2px solid' : '1px solid transparent',
                        borderColor: selectedStream === stream.id ? 'primary.main' : 'transparent',
                        '&:hover': { boxShadow: 4 }
                      }}
                      onClick={() => setSelectedStream(stream.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CameraAltIcon sx={{ mr: 1 }} />
                          <Typography variant="h6">{stream.name}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {stream.position}
                        </Typography>
                        <Chip 
                          label={
                            stream.status === 'online' ? '在线' : 
                            stream.status === 'loading' ? '连接中' :
                            stream.status === 'offline' ? '离线' : '错误'
                          }
                          color={
                            stream.status === 'online' ? 'success' : 
                            stream.status === 'loading' ? 'info' :
                            stream.status === 'offline' ? 'default' : 'error'
                          }
                          size="small"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </>
        )}

        {/* 威胁警报标签页 */}
        {tabValue === 1 && (
          <>
            {/* 威胁警报列表 */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                当前威胁警报 ({status.dangerDetection.alertCount})
              </Typography>
              
              {status.dangerDetection.threats.length > 0 ? (
                <List>
                  {status.dangerDetection.threats.map((threat, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <SecurityIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={threat.type}
                        secondary={`位置: ${threat.location} | 时间: ${threat.time.toLocaleString()}`}
                      />
                      <Chip 
                        label={threat.level}
                        color={getDangerLevelColor(threat.level)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  当前没有威胁警报，系统运行正常
                </Alert>
              )}
            </Paper>

            {/* 环境安全等级 */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                环境安全等级
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 3 }}>
                <Chip 
                  label={`当前等级: ${status.environment.dangerLevel.toUpperCase()}`}
                  color={getDangerLevelColor(status.environment.dangerLevel)}
                  size="large"
                  sx={{ fontSize: '1.2rem', p: 3 }}
                />
              </Box>
              
              <Typography variant="body1" align="center">
                环境: {status.environment.surroundings} | 光照: {status.environment.lighting}
              </Typography>
            </Paper>
          </>
        )}

        {/* 设备状态标签页 */}
        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              摄像头设备状态
            </Typography>
            
            <List>
              {status.environment.cameras.map((camera) => (
                <ListItem key={camera.id}>
                  <ListItemIcon>
                    <CameraAltIcon color={camera.status === 'online' ? 'primary' : 'disabled'} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={camera.name}
                    secondary={`位置: ${camera.position}`}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={camera.status === 'online' ? '在线' : '离线'}
                      color={camera.status === 'online' ? 'success' : 'error'}
                      size="small"
                    />
                    {camera.status === 'online' && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                          setTabValue(0);
                          const streamIndex = videoStreams.findIndex(s => s.name.includes(camera.name));
                          if (streamIndex !== -1) {
                            setSelectedStream(videoStreams[streamIndex].id);
                          }
                        }}
                      >
                        查看
                      </Button>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
      
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => {
            setNavValue(newValue);
            
            switch(newValue) {
              case 0: 
                navigate('/');
                break;
              case 1:
                navigate('/first');
                break;
              case 2:
                // 当前页面
                break;
              case 3:
                navigate('/third');
                break;
              default:
                break;
            }
          }}
        >
          <BottomNavigationAction label="首页" icon={<HomeIcon />} />
          <BottomNavigationAction label="服务" icon={<GridViewIcon />} />
          <BottomNavigationAction label="警告" icon={<WarningIcon />} />
          <BottomNavigationAction label="我的" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Container>
  );
};

export default Second;
