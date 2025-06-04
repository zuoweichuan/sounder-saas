class ApiService {
  static instance = null;
  
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    // 从localStorage获取保存的身份验证信息
    this.token = localStorage.getItem('token');
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('email');
    
    console.log('ApiService初始化, token状态:', this.token ? '存在' : '不存在');
  }
  
  static getInstance() {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
  
  // 简化的检查认证状态方法 - 不依赖API
  isAuthenticated() {
    return !!this.token;
  }
  
  async fetch(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败，状态码: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`API请求失败: ${endpoint}`, error);
      throw error;
    }
  }
 
// filepath: [ApiService.js](http://_vscodecontentref_/1)
async login(email, password) {
  try {
    const data = await this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    this._saveAuthData(data.token, data.user.username, data.user.email);
    return data;
  } catch (err) {
    console.log('API登录失败:', err);
    
    // 删除或注释掉开发环境的模拟登录逻辑
    // if (process.env.NODE_ENV === 'development') {
    //   if (email && password && password.length >= 6) {
    //     const mockData = {...};
    //     this._saveAuthData(mockData.token, mockData.user.username, mockData.user.email);
    //     return mockData;
    //   }
    // }
    
    throw new Error('登录失败: 无效的邮箱或密码');
  }
}

  _saveAuthData(token, username, email) {
    this.token = token;
    this.username = username || 'User';
    this.email = email || '';
    
    localStorage.setItem('token', token);
    localStorage.setItem('username', username || 'User');
    if (email) localStorage.setItem('email', email);
    
    console.log('认证数据已保存，token:', token.substring(0, 15) + '...');
  }
  
async register(username, email, password, name, companyName) {
  try {
    const data = await this.fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        // 修改此处，移除username字段，使用name作为用户名
        name: name || username,  // 使用name或username作为name字段
        email,
        password,
        companyName
      })
    });
    
    return data;
  } catch (err) {
    console.log('API注册失败，错误:', err);
    throw err;
  }
}
  logout() {
    this.token = null;
    this.username = null;
    this.email = null;
    
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    
    console.log('用户已登出，认证数据已清除');
  }
  
  async getCurrentUser() {
    if (!this.token) {
      console.log('getCurrentUser: 没有token，返回null');
      return null;
    }
    
    try {
      const data = await this.fetch('/users/me');
      return data.user;
    } catch (err) {
      console.log('获取用户信息失败，使用本地存储的信息');
      
      // 关键修改：API调用失败时，只要有token，仍然返回用户信息
      // 这样即使API端点不可用，用户也能保持登录状态
      if (this.token) {
        return {
          username: this.username || '用户',
          email: this.email || ''
        };
      }
      
      return null;
    }
  }
}

export default ApiService;
