import { router, ComposeTitleBar, promptAction } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { ApiService } from '../utils/ApiService';

@Entry
@Component
struct LoginPage {
  @State email: string = '';
  @State password: string = '';
  @State isLoading: boolean = false;
  private apiService: ApiService = ApiService.getInstance();

  aboutToAppear() {
    // 设置API基础URL
    this.apiService.setBaseUrl('http://your-backend-server:5000/api');
  }

  build() {
    Column() {
      // 顶部标题栏
      ComposeTitleBar({
        title: "登录"
      })

      // Logo区域
      Image($r('app.media.img4'))
        .height(100)
        .width(300)
        .margin({ top: 50, bottom: 50 })

      // 登录表单
      Column() {
        // 电子邮箱输入框
        TextInput({ placeholder: '请输入电子邮箱' })
          .type(InputType.Email)
          .onChange((value) => {
            this.email = value;
          })
          .width('80%')
          .height(50)
          .margin({ bottom: 20 })
          .borderRadius(8)
          .backgroundColor('#FFFFFF')
          .padding({ left: 10, right: 10 })

        // 密码输入框
        TextInput({ placeholder: '请输入密码' })
          .type(InputType.Password)
          .onChange((value) => {
            this.password = value;
          })
          .width('80%')
          .height(50)
          .borderRadius(8)
          .backgroundColor('#FFFFFF')
          .padding({ left: 10, right: 10 })

        // 登录按钮
        Button('登录')
          .width('80%')
          .height(50)
          .margin({ top: 30 })
          .backgroundColor('#1696db')
          .fontColor(Color.White)
          .borderRadius(8)
          .enabled(!this.isLoading)
          .onClick(() => {
            this.handleLogin();
          })

        if (this.isLoading) {
          LoadingProgress()
            .width(50)
            .height(50)
            .margin({ top: 20 })
            .color('#1696db')
        }

        // 注册链接
        Text('没有账号？立即注册')
          .fontColor('#1696db')
          .margin({ top: 20 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/register' }).catch((err: BusinessError) => {
              console.error(`Failed to navigate: ${err.message}`);
              promptAction.showToast({ message: '注册页面开发中' });
            });
          })
      }
      .width('100%')
      .backgroundColor('#f5f5f5')
      .borderRadius({ topLeft: 20, topRight: 20 })
      .padding({ top: 40, bottom: 40 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#e6f4f6')
  }

  async handleLogin() {
    if (!this.email || !this.password) {
      promptAction.showToast({ message: '请输入电子邮箱和密码' });
      return;
    }

    try {
      this.isLoading = true;
      const result = await this.apiService.login(this.email, this.password);
      
      promptAction.showToast({ message: '登录成功' });
      
      // 登录成功后跳转到首页
      router.pushUrl({ url: 'pages/Index' }).then(() => {
        console.info('Succeeded in jumping to home page after login.');
      }).catch((err: BusinessError) => {
        console.error(`Failed to navigate after login: ${err.message}`);
      });
      
    } catch (error) {
      console.error('登录失败:', error);
      promptAction.showToast({ message: '登录失败，请检查邮箱和密码' });
    } finally {
      this.isLoading = false;
    }
  }
}
