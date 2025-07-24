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
import MQTTTest from './pages/MQTTTest';
import ApiService from './utils/ApiService';
import VideoTest from './pages/VideoTest';
import './App.css';

// 简化的路由保护组件
const ProtectedRoute = ({ children }) => {
  const apiService = ApiService.getInstance();
  const isAuthenticated = apiService.isAuthenticated();
  
  if (!isAuthenticated) {
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
          
          <Route path="/mqtt-test" element={
            <ProtectedRoute>
              <MQTTTest />
            </ProtectedRoute>
          } />

	  <Route path="/video-test" element={
	    <ProtectedRoute>
    	      <VideoTest />
  	    </ProtectedRoute>
	  } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
