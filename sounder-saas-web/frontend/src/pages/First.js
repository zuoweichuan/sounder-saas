import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid,
  IconButton, BottomNavigation, BottomNavigationAction
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import GridViewIcon from '@mui/icons-material/GridView';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SpeakerIcon from '@mui/icons-material/Speaker';
import MicIcon from '@mui/icons-material/Mic';

const First = () => {
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState(1); // 默认选中"服务"

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            服务
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 2,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/id-check')}
            >
              <CreditCardIcon sx={{ fontSize: 60, mb: 1 }} />
              <Typography variant="h6">身份证号码查询</Typography>
            </Box>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/control')}
              >
                <SpeakerIcon sx={{ fontSize: 80, mb: 1 }} />
                <Typography variant="h6">控制音响</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/broadcast')}
              >
                <MicIcon sx={{ fontSize: 80, mb: 1 }} />
                <Typography variant="h6">喊话</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* 底部导航栏 - 与原HarmonyOS应用一致 */}
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
                // 当前页面，无需导航
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
