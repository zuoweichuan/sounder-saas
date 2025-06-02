import http from '@ohos.net.http';

export class ApiService {
  private static instance: ApiService;
  private baseUrl: string = 'http://localhost:5000/api';
  private token: string = '';
  private userData: any = null;
  private tenantData: any = null;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // 设置API基础URL
  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  // 获取API基础URL
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  // 设置认证Token
  public setToken(token: string): void {
    this.token = token;
  }

  // 获取用户信息
  public getUserData(): any {
    return this.userData;
  }

  // 获取租户信息
  public getTenantData(): any {
    return this.tenantData;
  }

  // 注册
  public async register(name: string, email: string, password: string, companyName: string): Promise<any> {
    try {
      let httpRequest = http.createHttp();
      let response = await httpRequest.request(
        `${this.baseUrl}/auth/register`,
        {
          method: http.RequestMethod.POST,
          header: {'Content-Type': 'application/json'},
          extraData: JSON.stringify({name, email, password, companyName})
        }
      );
      
      let result = JSON.parse(response.result as string);
      if (result.token) {
        this.token = result.token;
        this.userData = result.user;
        this.tenantData = result.tenant;
      }
      return result;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  }

  // 登录
  public async login(email: string, password: string): Promise<any> {
    try {
      let httpRequest = http.createHttp();
      let response = await httpRequest.request(
        `${this.baseUrl}/auth/login`,
        {
          method: http.RequestMethod.POST,
          header: {'Content-Type': 'application/json'},
          extraData: JSON.stringify({email, password})
        }
      );
      
      let result = JSON.parse(response.result as string);
      if (result.token) {
        this.token = result.token;
        this.userData = result.user;
        this.tenantData = result.tenant;
      }
      return result;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  // 获取设备列表
  public async getDevices(): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('未登录，请先调用login方法');
      }
      
      let httpRequest = http.createHttp();
      let response = await httpRequest.request(
        `${this.baseUrl}/devices`,
        {
          method: http.RequestMethod.GET,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        }
      );
      
      return JSON.parse(response.result as string);
    } catch (error) {
      console.error('获取设备列表失败:', error);
      throw error;
    }
  }

  // 创建设备
  public async createDevice(name: string, type: string, location: string): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('未登录，请先调用login方法');
      }
      
      let httpRequest = http.createHttp();
      let response = await httpRequest.request(
        `${this.baseUrl}/devices`,
        {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          extraData: JSON.stringify({name, type, location})
        }
      );
      
      return JSON.parse(response.result as string);
    } catch (error) {
      console.error('创建设备失败:', error);
      throw error;
    }
  }

  // 控制设备
  public async controlDevice(deviceId: string, action: string, params: any): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('未登录，请先调用login方法');
      }
      
      let httpRequest = http.createHttp();
      let response = await httpRequest.request(
        `${this.baseUrl}/devices/${deviceId}/control`,
        {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          extraData: JSON.stringify({action, params})
        }
      );
      
      return JSON.parse(response.result as string);
    } catch (error) {
      console.error('控制设备失败:', error);
      throw error;
    }
  }

  // 获取租户信息
  public async getCurrentTenant(): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('未登录，请先调用login方法');
      }
      
      let httpRequest = http.createHttp();
      let response = await httpRequest.request(
        `${this.baseUrl}/tenants/current`,
        {
          method: http.RequestMethod.GET,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        }
      );
      
      let result = JSON.parse(response.result as string);
      if (result.tenant) {
        this.tenantData = result.tenant;
      }
      return result;
    } catch (error) {
      console.error('获取租户信息失败:', error);
      throw error;
    }
  }
}
