import webview from '@ohos.web.webview';
// import router from '@system.router';
import common from '@ohos.app.ability.common';

import { router,ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { getCurrentTempx, getCurrentTempy, boolset, boolget,getcolor1,setcolor1,getcolor2,setcolor2
,getcolorused1,setcolorused1,getcolorused2,setcolorused2,getcolorused3,setcolorused3,getcolorused4,setcolorused4} from '../global';

@Entry
@Component
struct VideoPlayerPage {
  @State webController: webview.WebviewController = new webview.WebviewController();
  @State videoSrc: string = "http://192.168.137.100:12346/video_feed"; // 默认视频流地址
  @State inputSrc: string = this.videoSrc; // 用户输入的地址

  // 退出应用
  private terminateApp() {
    let context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
    context.terminateSelf()
      .then(() => {
        console.log('应用已退出');
      })
      .catch((err: Error) => {
        console.error(`退出应用失败: ${JSON.stringify(err)}`);
      });
  }

  build() {
    Column() {
      // 输入框，用于修改视频流地址
      // TextInput({ placeholder: '输入视频流地址', text: this.inputSrc })
      //   .width('90%')
      //   .height(40)
      //   .margin(10)
      //   .onChange((value: string) => {
      //     this.inputSrc = value; // 更新用户输入的值
      //   });

      // 确认按钮，用于更新视频流地址

      ComposeTitleBar({
        title: "视频"

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
      // 使用 WebView 组件嵌入网页
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
      Row(){Button('播放')
        .onClick(() => {
          if (this.inputSrc) {
            this.videoSrc = "http://192.168.0.2:12345/video_feed"; // 更新视频流地址
            this.webController.loadUrl(this.videoSrc);
            this.webController.refresh(); // 刷新 WebView 页面
          }
        })
        .margin(10);
      // 退出按钮
      Button('退出')
        .onClick(() => {
          setcolorused1('#1696db')
          setcolorused2('#2d2d2d')
          setcolorused3('#2d2d2d')
          setcolorused4('#2d2d2d')
          console.info(`Succeeded in clicking the 'Next' button.`)
          // 跳转到第一页
          router.pushUrl({ url: 'pages/Index' }).then(() => {
            console.info('Succeeded in jumping to the second page.')

          }).catch((err: BusinessError) => {
            console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
          })
        })
        .margin(10);}
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
                  console.info(`Succeeded in clicking the 'Next' button.`)
                  // 跳转到第一页
                  router.pushUrl({ url: 'pages/Index' }).then(() => {
                    console.info('Succeeded in jumping to the second page.')

                  }).catch((err: BusinessError) => {
                    console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
                  })


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
      .margin({ top: 100, left: 5 })
      .justifyContent(FlexAlign.SpaceBetween) // 等间距分布
    }

  }
}