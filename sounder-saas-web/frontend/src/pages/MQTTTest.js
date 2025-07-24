import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Button, TextField, Alert,
  Grid, Card, CardContent, IconButton, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import MQTTService from '../utils/MQTTService';

const MQTTTest = () => {
  const navigate = useNavigate();
  const mqttService = MQTTService.getInstance();
  
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testMessage, setTestMessage] = useState('TEST:Hello MQTT');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    // 添加消息处理器来接收所有消息
    const handleMessage = (message) => {
      const timestamp = new Date().toLocaleString();
      setReceivedMessages(prev => [
        { message, timestamp, id: Date.now() },
        ...prev.slice(0, 9) // 只保留最新的10条消息
      ]);
      setSuccess(`收到消息: ${message}`);
    };

    mqttService.addMessageHandler('mqttTest', handleMessage);

    // 检查连接状态
    setConnected(mqttService.isConnected);

    return () => {
      mqttService.removeMessageHandler('mqttTest');
    };
  }, [mqttService]);

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await mqttService.connect();
      setConnected(true);
      setSuccess('MQTT连接成功！');
      
      // 获取连接信息
      setConnectionInfo({
        server: mqttService.config.url,
        clientId: mqttService.config.clientId,
        username: mqttService.config.userName,
        publishTopic: mqttService.config.topic1,
        subscribeTopic: mqttService.config.topic2
      });
    } catch (err) {
      console.error('MQTT连接失败:', err);
      setError(`连接失败: ${err.message}`);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    mqttService.disconnect();
    setConnected(false);
    setConnectionInfo(null);
    setSuccess('MQTT连接已断开');
  };

  const handleSendMessage = async () => {
    if (!testMessage.trim()) {
      setError('请输入测试消息');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await mqttService.pushMessage1(testMessage);
      setSuccess(`消息发送成功: ${testMessage}`);
    } catch (err) {
      console.error('发送消息失败:', err);
      setError(`发送失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPresetMessages = [
    { label: '角度控制测试', message: 'X:13.333' },
    { label: 'Y轴控制测试', message: 'Y:14.2857' },
    { label: '身份查询测试', message: 'I:123456789012345678' },
    { label: '状态查询', message: 'STATUS:REQUEST' },
    { label: '自定义测试', message: 'CUSTOM:TEST_MESSAGE' }
  ];

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/first')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            MQTT通信测试
          </Typography>
        </Box>

        {/* 连接状态和信息 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              连接状态
            </Typography>
            <Chip 
              label={connected ? '已连接' : '未连接'}
              color={connected ? 'success' : 'error'}
              icon={<ConnectWithoutContactIcon />}
            />
          </Box>

          {connectionInfo && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>服务器:</strong> {connectionInfo.server}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>客户端ID:</strong> {connectionInfo.clientId}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>发送主题:</strong> {connectionInfo.publishTopic}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>接收主题:</strong> {connectionInfo.subscribeTopic}</Typography>
              </Grid>
            </Grid>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!connected ? (
              <Button
                variant="contained"
                onClick={handleConnect}
                disabled={loading}
                startIcon={<ConnectWithoutContactIcon />}
              >
                {loading ? '连接中...' : '连接MQTT'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleDisconnect}
                color="error"
              >
                断开连接
              </Button>
            )}
          </Box>
        </Paper>

        {/* 状态消息 */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* 消息发送测试 */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            消息发送测试
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="测试消息"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="输入要发送的MQTT消息"
              disabled={!connected}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!connected || loading || !testMessage.trim()}
              startIcon={<SendIcon />}
            >
              发送
            </Button>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            预设测试消息:
          </Typography>
          <Grid container spacing={1}>
            {testPresetMessages.map((preset, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => setTestMessage(preset.message)}
                  disabled={!connected}
                >
                  {preset.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* 接收消息日志 */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            接收消息日志 ({receivedMessages.length}/10)
          </Typography>
          
          {receivedMessages.length > 0 ? (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {receivedMessages.map((msg) => (
                <Card key={msg.id} sx={{ mb: 1 }}>
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="body2" component="div">
                      <strong>{msg.timestamp}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {msg.message}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              暂无接收到的消息
              {connected ? '，等待消息中...' : '，请先连接MQTT'}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default MQTTTest;
