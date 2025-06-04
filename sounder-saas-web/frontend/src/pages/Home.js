import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Paper, Card, CardContent, 
  IconButton, BottomNavigation, BottomNavigationAction, CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import ApiService from '../utils/ApiService';

const Home = () => {
  const navigate = useNavigate();
  const apiService = ApiService.getInstance();
  const [navValue, setNavValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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
  }, [apiService]);

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
          欢迎使用 Sounder SaaS
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          您好，{userData?.username || '用户'}
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            系统概览
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ minHeight: 140 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    服务
                  </Typography>
                  <Typography variant="body2">
                    查看和管理可用的系统服务
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ minHeight: 140 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    警告
                  </Typography>
                  <Typography variant="body2">
                    查看系统警告和通知
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ minHeight: 140 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    个人中心
                  </Typography>
                  <Typography variant="body2">
                    管理您的个人设置和账户信息
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
