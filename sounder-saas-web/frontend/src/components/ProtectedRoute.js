import React from 'react';
import { Navigate } from 'react-router-dom';
import ApiService from '../utils/ApiService';

const ProtectedRoute = ({ children }) => {
  const apiService = ApiService.getInstance();
  
  // 直接检查token，不再尝试API调用
  const isAuthenticated = apiService.isAuthenticated();
  console.log('路由保护检查，认证状态:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('未认证，重定向到登录页面');
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;
