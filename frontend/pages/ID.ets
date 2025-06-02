// Second.ets
// 导入页面路由模块
import webview from '@ohos.web.webview';
import common from '@ohos.app.ability.common';

import { router,ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
// import { ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI'
// .backgroundColor('#fbe9f0')
import { MQTTClient, MQTTOptionsType, EVENTID } from '../utils/MQTT2'
import { emitter } from '@kit.BasicServicesKit'
import { getCurrentTempx, getCurrentTempy, boolset, boolget,mesget,messet } from '../global';

// Second.ets
// 导入页面路由模块
// import { router,ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';
// import { BusinessError } from '@kit.BasicServicesKit';
// import { ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI'
// .backgroundColor('#fbe9f0')
// import router from '@system.router';
import prompt from '@system.prompt';

const MQTTOption: MQTTOptionsType = {
  url: 'mqtt://cb27b984ca.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883',
  clientId: '67cfb54724d772325524bd92_sounder0_0_0_2025031114',
  userName: '67cfb54724d772325524bd92_sounder0',
  password: 'fa186b2c9e17abc682f2aea8d97191fe468bb1e4850b99357f7b2ccd4441d529',
  topic1: '/test/M2M/01',
  topic2: '/test/M2M/02',

  qos: 1
}

const MQTTInstance: MQTTClient = MQTTClient.getInstance(MQTTOption)
@Entry
@Component
struct ID {
  @State refreshFlag: boolean = false // 控制刷新的标志位

  @State message: string = ''
  @State receiveMsg: string = ''
  @State receiveMsg1: string = ''

  @State sendMsg: string = ''
  @State result: string[] = ['']

  @State webController: webview.WebviewController = new webview.WebviewController();
  @State videoSrc: string = "http://192.168.01.2:12345/video_feed"; // 默认视频流地址
  @State inputSrc: string = this.videoSrc; // 用户输入的地址
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
  private updateData() {
    emitter.on({
      eventId: EVENTID
    }, (data) => {
      this.receiveMsg=JSON.stringify(data)
      messet(this.receiveMsg)
      this.receiveMsg1=mesget()
      this.result = (this.receiveMsg).split(":")
    });
  }
  private timerId: number = 0; // 定时器

  aboutToAppear() {
    // this.startAutoSwitch();
    this.timerId = setInterval(() => {
      this.refreshFlag = !this.refreshFlag // 翻转标志位触发刷新
      this.updateData() // 更新数据
    }, 1000) // 1秒间隔
  }
  build() {


    Column() {

      Row() {
        Column() {
          //分割线
          // Divider().height(5).color(0xCCCCCC)
          // Image($r('sys.media.ohos_save_button_filled'))
          ComposeTitleBar({
            title: "身份证号码查询"

            // subtitle: "副标题",
            // menuItems: this.menuItems.slice(0, 1),
          })
            .onClick(() => {
              console.info(`Succeeded in clicking the 'Next' button.`)
              // 跳转到第一页
              router.pushUrl({ url: 'pages/Index' }).then(() => {
                console.info('Succeeded in jumping to the second page.')

              }).catch((err: BusinessError) => {
                console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
              })
            })

        }
      }
      Row({ space: 16 }) {

        TextInput({ text: $$this.sendMsg, placeholder: '请填写需要查询的身份证号码' })
          .layoutWeight(1)
        Button('查询')
          .onClick(() => {
            if (this.sendMsg) {
              MQTTInstance.pushMessage1('I:'+this.sendMsg)
              this.sendMsg = ''
            }
            if (this.inputSrc) {
              this.videoSrc = "http://192.168.137.100:12346/video_feed";
              this.webController.loadUrl(this.videoSrc);
              this.webController.refresh();
            }
          })
      }

        Text('查询结果')
          .fontWeight(FontWeight.Bold)
          .margin({top:5,bottom:5})
        TextInput({ text: (this.receiveMsg1), placeholder: '接收到的消息' })
          // .layoutWeight(1)


      Web({
        src: this.videoSrc, // 动态绑定视频流地址
        controller: this.webController
      })
        .width(640) // 设置视频宽度为 640
        .height(480) // 设置视频高度为 480
        .onPageEnd(() => {
          console.log('页面加载完成');
        })
        .onHttpErrorReceive(() => {
          console.error('页面加载失败，请检查网络连接或视频流地址');
        });


      Column() {
        Image($r('app.media.cha'))
          .height(50)
          .width(60)
          .onClick(() => {
            console.info(`Succeeded in clicking the 'Next' button.`)
            // 跳转
            router.pushUrl({ url: 'pages/ID' }).then(() => {
              console.info('Succeeded in jumping to the second page.')

            }).catch((err: BusinessError) => {
              console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
            })
          })
        // .backgroundColor('#e30011')
        Row(){
          Text('身份证号码查询')
            .fontSize(20)
          // .fontWeight(FontWeight.Bold)//加粗

        }

      }
      .position({x:120,y:710})


    }
    .height('100%')
  }
}