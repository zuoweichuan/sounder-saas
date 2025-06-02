import { BusinessError } from '@kit.BasicServicesKit';
// import { currentTempx, currentTempy } from '../global';
import { getCurrentTempx, getCurrentTempy, boolset, boolget,getcolor1,setcolor1,getcolor2,setcolor2
,getcolorused1,setcolorused1,getcolorused2,setcolorused2,getcolorused3,setcolorused3,getcolorused4,setcolorused4,
  mesget,messet,
  setCurrentTempx,setCurrentTempy} from '../global';

// import { MQTTClient, MQTTOptionsType, EVENTID } from '../utils/MQTT3'
import { emitter } from '@kit.BasicServicesKit'
import { router, ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';


// import { Refresh } from '@arkts/5.0/components';

// .fontColor(['#6fcfeb'])

// const MQTTOption: MQTTOptionsType = {
//   url: 'mqtt://cb27b984ca.st1.iotda-device.cn-north-4.myhuaweicloud.com:1883',
//   clientId: '67cfb54724d772325524bd92_sounder0_0_0_2025031114',
//   userName: '67cfb54724d772325524bd92_sounder0',
//   password: 'fa186b2c9e17abc682f2aea8d97191fe468bb1e4850b99357f7b2ccd4441d529',
//   topic1: '/test/M2M/01',
//   topic2: '/test/M2M/03',
//
//   qos: 1
// }
// const MQTTInstance: MQTTClient = MQTTClient.getInstance(MQTTOption)

// const control = new control()


@Entry
@Component
struct HomePage {
  @State refreshFlag: boolean = false // 控制刷新的标志位
  private timerID1: number = 0 // 存储定时器ID
  @State message: string = '首页';
  @State currentImageIndex: number = 0; // 当前图片索引
  @State currentTempx: number = getCurrentTempx(); // 当前x度数
  @State currentTempy: number = getCurrentTempy(); // 当前y度数
  @State bool: number = 0;
  @State weizhi: string = '无';
  @State xian: number = 0;
  @State huan: string = '正常'
  @State she: string = '打开'

  @State dengji: string = '低'

  @State iconColor: string = 'transparent'; // State to control icon color (initially transparent)

  // @State messageMQTT: string = ''
  @State receiveMsg: string = ''
  // @State sendMsg: string = ''
  @State result: string[] = ['']


  private updateData() {
    console.log("刷新数据...")
    this.currentTempx=getCurrentTempx()
    this.currentTempy=getCurrentTempy()
    this.receiveMsg = mesget()
    this.result = (this.receiveMsg).split(":")
    if(this.result[3]==='1')
    {
      setCurrentTempx(Math.round(Number(this.result[4])))
      setCurrentTempy(Math.round(Number(this.result[5])))
      this.currentTempx=getCurrentTempx()
      this.currentTempy=getCurrentTempy()
    }
    else if(this.result[3]==='3')
    {
      if(this.result[4]==='0')
      {
        this.bool=0
      }
      else {
        this.bool=1

      }
    }
    else if(this.result[3]==='4')
    {
      if(this.result[4]==='0')
      {
        this. weizhi='A'
      }
      else if(this.result[4]==='1') {
        this.weizhi='B'

      }
      else if(this.result[4]==='-1'){
        this.weizhi='无'

      }
    }
    else if(this.result[3]==='5')
    {
      this.xian=Number(this.result[4])
    }

    else if(this.result[3]==='6')
    {
      if(this.result[4]==='0')
      {
        this.huan='正常'
      }
      else {
        this.huan='异常'

      }
    }
    else if(this.result[3]==='7')
    {
      if(this.result[4]==='1')
      {
        this.she='打开'
      }
      else {
        this.she='关闭'

      }
    }
    else if(this.result[3]==='8')
    {
      if(this.result[4]==='0')
      {
        this.dengji='低'
      }
      else if(this.result[4]==='1')
      {
        this.dengji='中'

      }
      else
      {
        this.dengji='高'
      }
    }
    this.handleBoolChange()

  }

  private blinkTimerId: number = 0; // To hold the timer for blinking effect

  private timerId: number = 0; // 定时器

  // 图片资源数组，直接在组件中定义
  private image1: Resource = $r('app.media.img1');
  private image2: Resource = $r('app.media.img2');
  private image3: Resource = $r('app.media.img3');






  handleBoolChange() {
    if (this.bool === 1 && !this.blinkTimerId) {

      this.blinkTimerId = setInterval(() => {

        this.iconColor = this.iconColor === 'red' ? 'transparent' : 'red';
      }, 500); // Change color every 500ms
    } else if (this.bool === 0 && this.blinkTimerId) {
      // When bool is 0, stop the blinking effect and reset the color
      clearInterval(this.blinkTimerId);
      this.blinkTimerId = 0;
      this.iconColor = 'transparent'; // Reset to transparent
    }
  }
  // onPageShow(): void {
  //   this.handleBoolChange(); // Call the function to manage the icon's blinking based on bool
  // }
  // 生命周期函数 - 页面显示时启动定时器
  aboutToAppear() {
    this.startAutoSwitch();
    this.timerID1 = setInterval(() => {
      this.refreshFlag = !this.refreshFlag // 翻转标志位触发刷新
      this.updateData() // 更新数据
    }, 1000) // 1秒间隔
  }

  // 生命周期函数 - 页面消失时清除定时器
  aboutToDisappear() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  // 启动自动切换
  startAutoSwitch() {
    this.timerId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % 3; // 3张图片轮播
    }, 5000); // 5秒切换一次
  }

  // onPageShow(): void {
  //   emitter.on({
  //     eventId: EVENTID
  //   }, (data) => {
  //     this.bool = Number(JSON.stringify(data))
  //   });
  //   this.handleBoolChange(); // Call the function to manage the icon's blinking based on bool
  // }

  build() {

    Row() {
      Column() {
        // Header Section

        Column() {






          Text(this.message)
            .fontSize(30)
            // .fontWeight('Bold')
            .fontWeight(FontWeight.Bold)
            .textAlign(TextAlign.Center)
            .margin({top:10})
        }
        .backgroundColor('#e6f4f6')
        .width('100%')
        .height('8%')
        .margin({ bottom: 10,top:0 });

        // Image Slider with Pagination Dots on Top
        Stack() { //  Stack 布局

          Column() {
            // 根据当前图片索引显示相应图片
            if (this.currentImageIndex === 0) {
              Image(this.image1)
                .width('90%')
                .height('20%')
                .objectFit(ImageFit.Cover)
                .borderRadius(20);
            } else if (this.currentImageIndex === 1) {
              Image(this.image2)
                .width('90%')
                .height('20%')
                .borderRadius(20)
                .objectFit(ImageFit.Cover);
            } else {
              Image(this.image3)
                .width('90%')
                .height('20%')
                .borderRadius(20)
                .objectFit(ImageFit.Cover);
            }
          }
          // .backgroundColor('#CDCDCD')
          .margin({ bottom: 5 ,top:5});

          // Pagination Dots
          Row() {
            // Create a dot for each image
            SymbolGlyph($r('sys.symbol.record_circle')) // 使用实心圆图标
              .fontSize(10)
              .width(10)
              .height(10)
              .margin({ right: 10 })
              .fontColor([this.currentImageIndex === 0 ? '#2b2b2b' : '#ffffff']);

            SymbolGlyph($r('sys.symbol.record_circle')) // Circle icon for the dot
              .fontSize(10)
              .width(10)
              .height(10)
              .margin({ right: 10 })
              .fontColor([this.currentImageIndex === 1 ? '#2b2b2b' : '#ffffff']);

            SymbolGlyph($r('sys.symbol.record_circle')) // Circle icon for the dot
              .fontSize(10)
              .width(10)
              .height(10)
              .margin({ right: 10 })
              .fontColor([this.currentImageIndex === 2 ? '#2b2b2b' : '#ffffff']);
          }
          .justifyContent(FlexAlign.Center)
          .width('100%')
          .margin({ top: 120 }); // 调整分页点的位置

        }

        // Real-Time Environment Data Section
        Column() {
          Row() {
            Row() {

                Text('  ')
                  .textCase(TextCase.Normal)
                    // .padding(15)
                    // .border({ width: 1 })
                    // .margin(5)
                  .margin({left:28})
                    // .backgroundColor('#Dcdcdc')
                  .backgroundColor('#6fcfeb')
                  .height(20)

              Text('实时状况:')
                .fontSize(18)
                // .fontWeight('Bold')
                .fontWeight(FontWeight.Bold)
                .margin({left:10})

              // Column() {
              //   Text('文本输出           ')
              //     .textCase(TextCase.Normal)
              //     .padding(5)
              //     .border({ width: 1 })
              //     .margin(5)
              //     .margin({left:0})
              //     .backgroundColor('#Dcdcdc')
              // }.margin({bottom:0})
            }
            .width('48%') // Adjust width as needed
          }
          .width('100%')
          .height(50)
          .margin({top:10})

        }
        .width('100%')
        .height('150px')
        .margin({ bottom: 0 });
Row() {
  SymbolGlyph($r('sys.symbol.local_fill'))
    .fontWeight(FontWeight.Lighter)
    .fontSize(30)
    .margin({ left: -30 })
    .fontColor(['#1696db'])

  SymbolGlyph($r('sys.symbol.eye'))
    .fontWeight(FontWeight.Lighter)
    .fontSize(30)
    .margin({left:80})
    .fontColor(['#1696db'])

  SymbolGlyph($r('sys.symbol.portrait'))
    .fontWeight(FontWeight.Bold)
    .fontSize(30)
    .margin({left:80})
    .fontColor(['#1696db'])

}
Row() {
  Text('音响位置')
    .margin({ left: -15 })
  Text('音响角度')
    .margin({ left: 40 })
  Text('嫌疑人数量')
    .margin({left:40})
}

        Row() {

            Text(`${this.weizhi}点`)
              .fontSize(15)
              .margin({ left: -40 })


  Text(`X: ${this.currentTempx}° Y: ${this.currentTempy}°`)
    .fontSize(15)
    // .margin({ left: 200 })// .backgroundColor('#CDCDCD')
    // .width('80%')
    .margin({ top: 0 ,left:70})

  Text(`${this.xian}`)
    .margin({left:70})
}

//////
        Column() {
          Row() {
              Text('  ')
                .textCase(TextCase.Normal)
                // .padding(15)
                // .border({ width: 1 })
                // .margin(5)
                .margin({left:10})
                // .backgroundColor('#Dcdcdc')
                .backgroundColor('#6fcfeb')
                .height(20)

            Text('危险感知')
              .fontSize(18)
              // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:10})

          }
          .width('44%')
          .margin({left:-180,top:20})


          Row() {
            SymbolGlyph($r('sys.symbol.hand_raised_hexagon_fill'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .margin({ left: 10 })
              .fontColor(['#03912d'])

            Text('周围环境')
              .fontSize(15)
                // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:10})
            // .backgroundColor()
            Text(`${this.huan}`)
           .fontSize(15)
    // .fontWeight('Bold')
           .fontWeight(FontWeight.Bold)
  // .margin({left:10})
          }
          .backgroundColor('#E7F5F6')
          .width('90%')
          .height(40)
          .margin({top:20,left:0})
          .borderRadius(8)


          Row() {
            SymbolGlyph($r('sys.symbol.hand_raised_hexagon_fill'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .margin({ left: 10 })
              .fontColor(['#03912d'])

            Text('多摄像头')
              .fontSize(15)
                // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:10})
            // .backgroundColor()
            Text(`${this.she}`)
              .fontSize(15)
                // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:0})
            // .backgroundColor()

          }
          .backgroundColor('#E7F5F6')
          .width('90%')
          .height(40)
          .margin({top:20,left:0})
          .borderRadius(8)


          Row() {
            SymbolGlyph($r('sys.symbol.hand_raised_hexagon_fill'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .margin({ left: 10 })
              .fontColor(['#03912d'])

            Text('目前危险等级')
              .fontSize(15)
                // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:10})

            // .backgroundColor()
            Text(`${this.dengji}`)
              .fontSize(15)
                // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:0})
            // .backgroundColor()
          }
          .backgroundColor('#E7F5F6')
          .width('90%')
          .height(40)
          .margin({top:20,left:0})
          .borderRadius(8)


        }
        .width('100%')
        .margin({ bottom: 10,top:0 });

        // Disease Detection Section

        Column(){

          Row() {
            Text('  ')
              .textCase(TextCase.Normal)
                // .padding(15)
                // .border({ width: 1 })
                // .margin(5)
              .margin({left:10})
                // .backgroundColor('#Dcdcdc')
              .backgroundColor('#6fcfeb')
              .height(20)

            Text('嫌疑人检测')
              .fontSize(18)
                // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:10})

          }
          .width('44%')
          .margin({left:-180,top:20})

          Row() {
            SymbolGlyph($r('sys.symbol.exclamationmark_shield_fill'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .margin({left:10})
              .fontColor(['#a15449'])

            Text('嫌疑人检测')
              .fontSize(15)
                // .fontWeight('Bold')
              .fontWeight(FontWeight.Bold)
              .margin({left:10})
              // .backgroundColor()

            SymbolGlyph($r('sys.symbol.exclamationmark_circle'))
                .fontWeight(FontWeight.Lighter)
                .fontSize(60)
                .margin({ left: 100,top:-10 })
                .fontColor([this.iconColor]) // Bind the icon color to the state
                .fontWeight(500)



          }
          .backgroundColor('#E7F5F6')
          .width('90%')
          .height(40)
          .margin({top:20,left:0})
          .borderRadius(8)

        }
        .height('120px')
        // .margin({ bottom: 10,top:0 })

        Row() {
          Column() {
            SymbolGlyph($r('sys.symbol.house'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .fontWeight(500)
              .fontColor([getcolorused1()])
              .onClick(() => {
                setcolorused1('#1696db')
                setcolorused2('#2d2d2d')
                setcolorused3('#2d2d2d')
                setcolorused4('#2d2d2d')
              })
              .overlay('首页', { align: Alignment.Bottom, offset: { x: 0, y:15 } })
          }
          .layoutWeight(1)

          Column() {
            SymbolGlyph($r('sys.symbol.square_fill_grid_2x2'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .fontColor([getcolorused2()])


              .overlay('服务', { align: Alignment.Bottom, offset: { x: 0, y: 15 } })
              .onClick(() => {
                setcolorused1('#2d2d2d')
                setcolorused2('#1696db')
                setcolorused3('#2d2d2d')
                setcolorused4('#2d2d2d')
                console.info(`Succeeded in clicking the 'Next' button.`)
                router.pushUrl({ url: 'pages/first' }).then(() => {
                  console.info('Succeeded in jumping to the second page.')
                }).catch((err: BusinessError) => {
                  console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
                })
              })
          }
          .layoutWeight(1)

          Column() {
            SymbolGlyph($r('sys.symbol.exclamationmark_triangle_fill'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .fontColor([getcolorused3()])

              .overlay('警告', { align: Alignment.Bottom, offset: { x: 0, y: 15 } })
              .onClick(() => {
                setcolorused1('#2d2d2d')
                setcolorused2('#2d2d2d')
                setcolorused3('#1696db')
                setcolorused4('#2d2d2d')
                console.info(`Succeeded in clicking the 'Next' button.`)
                router.pushUrl({ url: 'pages/second' }).then(() => {
                  console.info('Succeeded in jumping to the second page.')
                }).catch((err: BusinessError) => {
                  console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
                })
              })
          }
          .layoutWeight(1)

          Column() {
            SymbolGlyph($r('sys.symbol.person_crop_circle_fill_1'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(30)
              .fontColor([getcolorused4()])


              .overlay('我的', { align: Alignment.Bottom, offset: { x: 0, y: 15 } })
              .onClick(() => {
                setcolorused1('#2d2d2d')
                setcolorused2('#2d2d2d')
                setcolorused3('#2d2d2d')
                setcolorused4('#1696db')
                console.info(`Succeeded in clicking the 'Next' button.`)
                router.pushUrl({ url: 'pages/third' }).then(() => {
                  console.info('Succeeded in jumping to the second page.')
                }).catch((err: BusinessError) => {
                  console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
                })
              })
          }
          .layoutWeight(1)
        }
        .width('100%')
        .height(30)
        .margin({ top: 80, left: 5 })
        .justifyContent(FlexAlign.SpaceBetween) // 等间距分布
      }
      .width('100%')
      .height('100%');}

  }
}