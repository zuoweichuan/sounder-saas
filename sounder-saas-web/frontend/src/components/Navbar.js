import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  IconButton, Menu, MenuItem 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApiService from '../utils/ApiService';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const apiService = ApiService.getInstance();
  const user = apiService.getUserData();
  const isAuthenticated = !!apiService.token;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    apiService.clearAuth();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1696db' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          音响控制系统
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              欢迎, {user?.name || '用户'}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleMenu}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>个人资料</MenuItem>
              <MenuItem onClick={handleLogout}>退出登录</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              登录
            </Button>
            <Button color="inherit" component={Link} to="/register">
              注册
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
