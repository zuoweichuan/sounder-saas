// Second.ets
// 导入页面路由模块
// import http from '@ohos.net.http';
import http from '@ohos.net.http';
import { router,ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
// import { ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI'
// .backgroundColor('#fbe9f0')

@Entry
@Component
struct hanhua{
  @State message: string = ''
  @State buttonText: string = '开始录音';
  @State isRecording: boolean = false;
  // private menuItems: Array<ComposeTitleBarMenuItem> = [
  //   {
  //     //菜单图片资源
  //
  //     //启用图标
  //     isEnabled: true,
  //     //点击菜单时触发事件
  //     action: () => promptAction.showToast({ message: "show toast index 1" })
  //   }
  //
  // ]

  build() {


    Column() {






      Row() {
        Column() {
          //分割线
          // Divider().height(5).color(0xCCCCCC)
          // Image($r('sys.media.ohos_save_button_filled'))
          ComposeTitleBar({
            title: "喊话"

            // subtitle: "副标题",
            // menuItems: this.menuItems.slice(0, 1),
          })
            .onClick(() => {
              console.info(`Succeeded in clicking the 'Next' button.`)
              // 跳转到第一页
              router.pushUrl({ url: 'pages/main' }).then(() => {
                console.info('Succeeded in jumping to the second page.')

              }).catch((err: BusinessError) => {
                console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
              })
            })

        }
      }







      Column() {
        SymbolGlyph($r('sys.symbol.mic_fill'))
          .fontWeight(FontWeight.Lighter)
          .fontSize(100)
          .onTouch((event: TouchEvent) => {
            if (event.type === TouchType.Down) {
              if (!this.isRecording) {
                this.startRecording();
              } else {
                this.stopRecording();
              }
            }
          })




      Text(this.buttonText)
        .position({x:10,y:-20})
        .fontSize(20)


        Row() {
          Text('喊话')
            .fontSize(20)
          // .fontWeight(FontWeight.Bold)//加粗

        }
      }
      .position({x:150,y:660})

    }
    .height('100%')
  }


  private startRecording() {
    this.buttonText = '停止录音';
    this.isRecording = true;
    this.sendRequest('lumos');
  }

  private stopRecording() {
    this.buttonText = '开始录音';
    this.isRecording = false;
    this.sendRequest('stop');
  }

  private sendRequest(action: string) {
    const url = `http://10.51.4.233:8000/${action}`;
    let httpRequest = http.createHttp();
    httpRequest.request(
      url,
      { method: http.RequestMethod.POST },
      (err, data) => {
        if (err) {
          console.log('Error sending request:', err);
          // 可以在这里添加错误处理逻辑，例如重试或用户提示
        } else {
          console.log('Response:', data);
        }
      }
    );
  }
}

