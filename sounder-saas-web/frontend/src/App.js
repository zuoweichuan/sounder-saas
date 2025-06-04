import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import First from './pages/First';
import Second from './pages/Second';
import Third from './pages/Third';
import Control from './pages/Control';
import Broadcast from './pages/Broadcast';
import IdCheck from './pages/IdCheck';
import ApiService from './utils/ApiService';
import './App.css';

// 简化的路由保护组件 - 只依赖localStorage中的token
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/first" element={
            <ProtectedRoute>
              <First />
            </ProtectedRoute>
          } />
          
          <Route path="/second" element={
            <ProtectedRoute>
              <Second />
            </ProtectedRoute>
          } />
          
          <Route path="/third" element={
            <ProtectedRoute>
              <Third />
            </ProtectedRoute>
          } />
          
          <Route path="/control" element={
            <ProtectedRoute>
              <Control />
            </ProtectedRoute>
          } />
          
          <Route path="/broadcast" element={
            <ProtectedRoute>
              <Broadcast />
            </ProtectedRoute>
          } />
          
          <Route path="/id-check" element={
            <ProtectedRoute>
              <IdCheck />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
