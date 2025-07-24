import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Paper, Card, CardContent, 
  IconButton, BottomNavigation, BottomNavigationAction, CircularProgress,
  Chip, Badge
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import SpeakerIcon from '@mui/icons-material/Speaker';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SecurityIcon from '@mui/icons-material/Security';
import ApiService from '../utils/ApiService';
import SystemStatusService from '../utils/SystemStatusService';

const Home = () => {
  const navigate = useNavigate();
  const apiService = ApiService.getInstance();
  const systemStatus = SystemStatusService.getInstance();
  const [navValue, setNavValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState(systemStatus.getStatus());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setUserData(user || { username: apiService.username });
      } catch (error) {
        console.error('获取用户信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // 订阅系统状态更新
    const unsubscribe = systemStatus.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    // 启动模拟数据更新
    systemStatus.startSimulation();

    return unsubscribe;
  }, [apiService, systemStatus]);

  const getDangerLevelColor = (level) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getDangerLevelText = (level) => {
    switch (level) {
      case 'low': return '安全';
      case 'medium': return '注意';
      case 'high': return '危险';
      case 'critical': return '紧急';
      default: return '未知';
    }
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
        <Typography variant="h4" component="h1" gutterBottom>
          智能追踪系统控制台
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          您好，{userData?.username || '用户'}
        </Typography>

        {/* 系统状态概览 */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            系统状态概览
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* 音响状态 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ minHeight: 180 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SpeakerIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">音响状态</Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    位置: X:{status.speaker.position.x}, Y:{status.speaker.position.y}, Z:{status.speaker.position.z}m
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    角度: X轴:{status.speaker.angle.x}°, Y轴:{status.speaker.angle.y}°
                  </Typography>
                  <Chip 
                    label={status.speaker.status === 'online' ? '在线' : '离线'} 
                    color={status.speaker.status === 'online' ? 'success' : 'error'}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* 追踪目标状态 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ minHeight: 180 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">追踪目标</Typography>
                  </Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {status.targets.count}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    活跃目标: {status.targets.active}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    已识别: {status.targets.identified} | 未识别: {status.targets.unidentified}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 环境状态 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ minHeight: 180 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CameraAltIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">环境监控</Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    环境: {status.environment.surroundings}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    摄像头: {status.environment.cameras.filter(c => c.status === 'online').length}/{status.environment.cameras.length} 在线
                  </Typography>
                  <Chip 
                    label={`危险等级: ${getDangerLevelText(status.environment.dangerLevel)}`}
                    color={getDangerLevelColor(status.environment.dangerLevel)}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* 危险检测 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ minHeight: 180 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge badgeContent={status.dangerDetection.alertCount} color="error">
                      <SecurityIcon sx={{ mr: 1 }} />
                    </Badge>
                    <Typography variant="h6">危险检测</Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    检测状态: {status.dangerDetection.enabled ? '已启用' : '已禁用'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    威胁警报: {status.dangerDetection.alertCount} 个
                  </Typography>
                  {status.dangerDetection.threats.length > 0 && (
                    <Chip 
                      label={`最新: ${status.dangerDetection.threats[status.dangerDetection.threats.length - 1].type}`}
                      color="warning"
                      size="small"
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* 功能模块 */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            系统功能
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ minHeight: 140, cursor: 'pointer' }} onClick={() => navigate('/first')}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    服务管理
                  </Typography>
                  <Typography variant="body2">
                    查看和管理音响控制、追踪目标识别等系统服务
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ minHeight: 140, cursor: 'pointer' }} onClick={() => navigate('/second')}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    安全警报
                  </Typography>
                  <Typography variant="body2">
                    查看系统安全警报、威胁检测和环境监控信息
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ minHeight: 140, cursor: 'pointer' }} onClick={() => navigate('/third')}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    个人中心
                  </Typography>
                  <Typography variant="body2">
                    管理您的个人设置、账户信息和系统配置
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => {
            setNavValue(newValue);
            
            switch(newValue) {
              case 0: 
                // 当前页面
                break;
              case 1:
                navigate('/first');
                break;
              case 2:
                navigate('/second');
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

export default Home;

