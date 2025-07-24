import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Paper, IconButton, BottomNavigation, BottomNavigationAction
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import GroupIcon from '@mui/icons-material/Group';
import WifiIcon from '@mui/icons-material/Wifi';
import VideocamIcon from '@mui/icons-material/Videocam';

const First = () => {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(1);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            服务管理中心
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: 200, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => navigate('/control')}
            >
              <ControlCameraIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
              <Typography variant="h5" align="center">
                音响控制
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                控制音响设备的角度和位置
              </Typography>
            </Paper>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  height: 200, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 6 }
                }}
                onClick={() => navigate('/video-test')}
              >
                <VideocamIcon sx={{ fontSize: 60, mb: 2, color: 'success.main' }} />
                <Typography variant="h5" align="center">
                  视频流测试
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  测试本地摄像头和视频流显示
                </Typography>
              </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: 200, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => navigate('/target-management')}
            >
              <GroupIcon sx={{ fontSize: 60, mb: 2, color: 'secondary.main' }} />
              <Typography variant="h5" align="center">
                目标库管理
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                管理人员数据库和分组信息
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: 200, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => navigate('/mqtt-test')}
            >
              <WifiIcon sx={{ fontSize: 60, mb: 2, color: 'info.main' }} />
              <Typography variant="h5" align="center">
                MQTT通信测试
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                测试MQTT连接和消息通信
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: 200, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => navigate('/video-test')}
            >
              <VideocamIcon sx={{ fontSize: 60, mb: 2, color: 'success.main' }} />
              <Typography variant="h5" align="center">
                视频流测试
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                测试视频流连接和显示
              </Typography>
            </Paper>
          </Grid>
        </Grid>
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
                // 当前页面
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

export default First;

