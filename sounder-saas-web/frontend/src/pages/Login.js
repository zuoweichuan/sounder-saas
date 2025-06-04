import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, TextField, Button, Paper,
  CircularProgress, Alert, Grid
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ApiService from '../utils/ApiService';

const Login = () => {
  const navigate = useNavigate();
  const apiService = ApiService.getInstance();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 如果已经有token，则自动导航到首页
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate, apiService]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('请输入电子邮箱或用户名');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // 调用登录API
      const response = await apiService.login(email, password);
      
      console.log('登录成功:', response);
      
      // 跳转到首页
      navigate('/');
    } catch (err) {
      console.error('登录失败:', err);
      setError('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  // 简化测试的辅助函数
  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              p: 2, 
              borderRadius: '50%',
              mb: 1
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white' }} />
          </Box>
          <Typography component="h1" variant="h5">
            Sounder SaaS 登录
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="用户名或电子邮箱"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '登录'}
          </Button>
          
          {/* 快速登录按钮 - 简化测试 */}
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={handleDemoLogin}
          >
            快速演示登录
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="primary">
                  {"还没有账号？立即注册"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
