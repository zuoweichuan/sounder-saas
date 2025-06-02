import { router, ComposeTitleBar, promptAction } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { ApiService } from '../utils/ApiService';

@Entry
@Component
struct RegisterPage {
  @State name: string = '';
  @State email: string = '';
  @State password: string = '';
  @State confirmPassword: string = '';
  @State companyName: string = '';
  @State isLoading: boolean = false;
  private apiService: ApiService = ApiService.getInstance();

  build() {
    Column() {
      // 顶部标题栏
      ComposeTitleBar({
        title: "注册"
      })
        .onClick(() => {
          router.back();
        })

      // Logo区域
      Image($r('app.media.img4'))
        .height(80)
        .width(240)
        .margin({ top: 30, bottom: 30 })

      // 注册表单
      Column() {
        // 姓名输入框
        TextInput({ placeholder: '请输入姓名' })
          .onChange((value) => {
            this.name = value;
          })
          .width('80%')
          .height(50)
          .margin({ bottom: 15 })
          .borderRadius(8)
          .backgroundColor('#FFFFFF')
          .padding({ left: 10, right: 10 })

        // 电子邮箱输入框
        TextInput({ placeholder: '请输入电子邮箱' })
          .type(InputType.Email)
          .onChange((value) => {
            this.email = value;
          })
          .width('80%')
          .height(50)
          .margin({ bottom: 15 })
          .borderRadius(8)
          .backgroundColor('#FFFFFF')
          .padding({ left: 10, right: 10 })

        // 公司名称输入框
        TextInput({ placeholder: '请输入公司名称' })
          .onChange((value) => {
            this.companyName = value;
          })
          .width('80%')
          .height(50)
          .margin({ bottom: 15 })
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
          .margin({ bottom: 15 })
          .borderRadius(8)
          .backgroundColor('#FFFFFF')
          .padding({ left: 10, right: 10 })

        // 确认密码输入框
        TextInput({ placeholder: '请确认密码' })
          .type(InputType.Password)
          .onChange((value) => {
            this.confirmPassword = value;
          })
          .width('80%')
          .height(50)
          .borderRadius(8)
          .backgroundColor('#FFFFFF')
          .padding({ left: 10, right: 10 })

        // 注册按钮
        Button('注册')
          .width('80%')
          .height(50)
          .margin({ top: 30 })
          .backgroundColor('#1696db')
          .fontColor(Color.White)
          .borderRadius(8)
          .enabled(!this.isLoading)
          .onClick(() => {
            this.handleRegister();
          })

        if (this.isLoading) {
          LoadingProgress()
            .width(50)
            .height(50)
            .margin({ top: 20 })
            .color('#1696db')
        }

        // 登录链接
        Text('已有账号？立即登录')
          .fontColor('#1696db')
          .margin({ top: 20 })
          .onClick(() => {
            router.back();
          })
      }
      .width('100%')
      .backgroundColor('#f5f5f5')
      .borderRadius({ topLeft: 20, topRight: 20 })
      .padding({ top: 30, bottom: 30 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#e6f4f6')
  }

  async handleRegister() {
    // 表单验证
    if (!this.name || !this.email || !this.password || !this.confirmPassword || !this.companyName) {
      promptAction.showToast({ message: '请填写所有必填项' });
      return;
    }

    if (this.password !== this.confirmPassword) {
      promptAction.showToast({ message: '两次输入的密码不一致' });
      return;
    }

    try {
      this.isLoading = true;
      const result = await this.apiService.register(this.name, this.email, this.password, this.companyName);
      
      promptAction.showToast({ message: '注册成功' });
      
      // 注册成功后跳转到首页
      router.pushUrl({ url: 'pages/Index' }).then(() => {
        console.info('Succeeded in jumping to home page after registration.');
      }).catch((err: BusinessError) => {
        console.error(`Failed to navigate after registration: ${err.message}`);
      });
      
    } catch (error) {
      console.error('注册失败:', error);
      promptAction.showToast({ message: '注册失败，请稍后再试' });
    } finally {
      this.isLoading = false;
    }
  }
}
