// 测试API服务是否正常工作
const apiService = ApiService.getInstance();

// 测试登录
async function testLogin() {
  try {
    const result = await apiService.login('test@example.com', 'password123');
    console.log('登录成功:', result);
    return result;
  } catch (error) {
    console.error('登录测试失败:', error);
  }
}

// 测试获取设备
async function testGetDevices() {
  try {
    const devices = await apiService.getDevices();
    console.log('获取设备成功:', devices);
    return devices;
  } catch (error) {
    console.error('获取设备测试失败:', error);
  }
}

// 运行测试
testLogin().then(() => testGetDevices());
