import { MQTTClient, MQTTOptionsType, EVENTID } from '../utils/MQTTClientInstance'
import { emitter } from '@kit.BasicServicesKit'
// Second.ets
// 导入页面路由模块
import { router,ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
// import { ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI'
// .backgroundColor('#fbe9f0')
// import router from '@system.router';
import prompt from '@system.prompt';
// import { currentTempx, currentTempy } from '../global';
import { getCurrentTempx, getCurrentTempy, boolset, boolget,getcolor1,setcolor1,getcolor2,setcolor2
,getcolorused1,setcolorused1,getcolorused2,setcolorused2,getcolorused3,setcolorused3,getcolorused4,setcolorused4,
  mesget,messet,
  setCurrentTempx,setCurrentTempy} from '../global';
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
struct Index {
  @State receiveMsg: string = ''
  @State sendMsg: string = ''
  @State currentTempx: number = getCurrentTempx(); // 当前x度数
  @State currentTempy: number = getCurrentTempy(); // 当前y度数
  private adjustx(change: number) {


    const newTempx = this.currentTempx + change;
    if (newTempx >= -90 && newTempx <= 90) {
      this.currentTempx = newTempx;
      setCurrentTempx(this.currentTempx);
      this.showToast(`X轴角度已调整为 ${this.currentTempx}°`);
    }
  }

  private adjusty(change: number) {


    const newTempy = this.currentTempy + change;
    if (newTempy >= -90 && newTempy <= 90) {
      this.currentTempy = newTempy;
      setCurrentTempy(this.currentTempy);

      this.showToast(`Y轴角度已调整为 ${this.currentTempy}°`);
    }
  }

  // 显示提示
  private showToast(message: string) {
    prompt.showToast({
      message: message,
      duration: 1500
    });
  }

  onPageShow(): void {
    emitter.on({
      eventId: EVENTID
    }, (data) => {
      this.receiveMsg = JSON.stringify(data)
    });
  }

  build() {
    Column() {
      Row() {
        Column() {
          //分割线
          // Divider().height(5).color(0xCCCCCC)
          // Image($r('sys.media.ohos_save_button_filled'))
          ComposeTitleBar({
            title: "控制音响"

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
        .margin({bottom:-30})
      }

      Row() {


        Text('手动控制模式')
          .fontSize(30)
          .margin({left:70})
          .fontWeight(FontWeight.Bold)



      }
      .backgroundColor('#e6f4f6')
      .width('90%')
      .height(60)
      .borderRadius(8)

      .position({x:18,y:70})

      Stack({alignContent:Alignment.Bottom}) {
        Column() {
          // 角度调节按钮
          Stack({ alignContent: Alignment.Bottom }) {
            Circle({ width: 70, height: 70 })
              .fillOpacity(1)
              .fill('#E7F5F6')

              .position({x: 2, y: 270})


            SymbolGlyph($r('sys.symbol.arrowtriangle_up_fill'))
              .fontColor(['#1696db'])
              .fontWeight(FontWeight.Lighter)
              .fontSize(80)
              .position({x: 12, y: 255})

              .width(60)
              .height(60)
              .onClick(() => {
                this.adjusty(5)
                if (String(this.currentTempy)) {
                  MQTTInstance.pushMessage1('Y:' + String('14.2857'))
                }
              })
          }


          Row({ space: 20 }) {
            Stack({ alignContent: Alignment.Bottom }) {
              Circle({ width: 70, height: 70 })
                .fillOpacity(1)
                .fill('#E7F5F6')
                .position({x:50,y:370})

              SymbolGlyph($r('sys.symbol.arrowtriangle_down_fill'))
                .fontWeight(FontWeight.Lighter)
                .fontSize(80)
                .position({x:120,y:380})

                .width(60)
                .height(60)
                .fontColor(['#1696db'])
                .rotate({
                  x: 0,
                  y: 0,
                  z: 1,
                  angle: 90,
                  centerX: 0,
                  centerY: 0,
                })
                .onClick(() => {
                  if (String(this.currentTempx)) {
                    this.adjustx(-5)
                    MQTTInstance.pushMessage1('X:' + String('-13.333'))
                    // this.sendMsg = ''
                  }
                })
            }

            Stack({ alignContent: Alignment.Bottom }) {
              Circle({ width: 70, height: 70 })
                .fillOpacity(1)
                .fill('#E7F5F6')
                .position({x:160,y:365})

              SymbolGlyph($r('sys.symbol.arrowtriangle_up_fill'))
                .fontColor(['#1696db'])
                .fontWeight(FontWeight.Lighter)
                .fontSize(80)
                .position({x:240,y:375})

                .width(60)
                .height(60)
                .rotate({
                  x: 0,
                  y: 0,
                  z: 1,
                  angle: 90,
                  centerX: 0,
                  centerY: 0,
                })
                .onClick(() => {
                  if (String(this.currentTempx)) {
                    this.adjustx(5)

                    MQTTInstance.pushMessage1('X:' + String('13.333'))
                    // this.sendMsg = ''
                  }
                })
            }
          }
          .position({x:0,y:0})


          Stack({ alignContent: Alignment.Bottom }) {
            Circle({ width: 70, height: 70 })
              .fillOpacity(1)
              .fill('#E7F5F6')

              .position({x: 150, y: 395})

            SymbolGlyph($r('sys.symbol.arrowtriangle_down_fill'))
              .fontColor(['#1696db'])
              .fontWeight(FontWeight.Lighter)
              .fontSize(80)

              .position({x: 160, y: 400})


              .width(60)
              .height(60)
              .width('100%')// .padding(20)
              .onClick(() => {
                this.adjusty(-5)
                if (String(this.currentTempy)) {
                  MQTTInstance.pushMessage1('Y:' + String('-14.2857'))
                  // this.sendMsg = ''
                }
              })
          }

        }

      }
      Column(){


        Circle()
          .width(270)
          .height(270)
          .fillOpacity(0)
          .strokeWidth(3)
          .stroke('#1696db')
          .opacity(0.3)
          // .position({ x: 10, y: 10 })
          .position({x: 60, y: 303})
      }

     Column() {
        Image($r('app.media.yin'))
          .height(90)
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

        Text('控制音响')
          .fontSize(20)
        // .fontWeight(FontWeight.Bold)//加粗

      }
      .position({x:143,y:660})
    }
    .padding(10)
    .width('100%')
  }
}
