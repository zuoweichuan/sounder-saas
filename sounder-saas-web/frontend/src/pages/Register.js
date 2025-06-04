import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, TextField, Button, Paper,
  CircularProgress, Alert, Grid, Divider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ApiService from '../utils/ApiService';

const Register = () => {
  const navigate = useNavigate();
  const apiService = ApiService.getInstance();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    // 添加租户字段
    name: '',          // 租户名称
    companyName: ''    // 公司名称
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const { username, email, password, confirmPassword, name, companyName } = formData;
    
    // 验证所有必填字段
    if (!username || !email || !password || !confirmPassword || !name || !companyName) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 调用注册API，传递租户信息
      await apiService.register(username, email, password, name, companyName);
      
      // 注册成功，跳转到登录页
      navigate('/login', { state: { message: '注册成功，请登录' } });
    } catch (err) {
      console.error('注册失败:', err);
      setError('注册失败: ' + (err.message || '请稍后再试'));
    } finally {
      setLoading(false);
    }
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
            Sounder SaaS 注册
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="用户名"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            autoFocus
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="电子邮箱"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          
          {/* 租户信息字段 */}
          <Divider sx={{ my: 2 }}>租户信息</Divider>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="租户名称"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            helperText="您的组织或团队的名称"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="companyName"
            label="公司名称"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            disabled={loading}
          />
          
          <Divider sx={{ my: 2 }}>密码设置</Divider>
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="确认密码"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '注册'}
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="primary">
                  {"已有账号？前往登录"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
