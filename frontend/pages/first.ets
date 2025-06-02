// Second.ets
// 导入页面路由模块
import { router,ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
// import { ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI'
import { getCurrentTempx, getCurrentTempy, boolset, boolget,getcolor1,setcolor1,getcolor2,setcolor2
,getcolorused1,setcolorused1,getcolorused2,setcolorused2,getcolorused3,setcolorused3,getcolorused4,setcolorused4} from '../global';

@Entry
@Component
struct second{
  @State message: string = ''
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
            title: "服务"

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
        .onClick(() => {
          console.info(`Succeeded in clicking the 'Next' button.`)
          // 跳转
          router.pushUrl({ url: 'pages/ID' }).then(() => {
            console.info('Succeeded in jumping to the second page.')

          }).catch((err: BusinessError) => {
            console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
          })
        })

        Row(){
          Column() {
            Image($r('app.media.yin'))
              .height(90)
              .width(60)
            Row() {
              Text('控制音响')
                .fontSize(20)
              // .fontWeight(FontWeight.Bold)//加粗

            }
          }
          .margin({right:50})
          .onClick(() => {
            console.info(`Succeeded in clicking the 'Next' button.`)
            // 跳转
            router.pushUrl({ url: 'pages/control' }).then(() => {
              console.info('Succeeded in jumping to the second page.')

            }).catch((err: BusinessError) => {
              console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
            })
          })
          Column() {
            SymbolGlyph($r('sys.symbol.mic_fill'))
              .fontWeight(FontWeight.Lighter)
              .fontSize(100)
            Row() {
              Text('喊话')
                .fontSize(20)
              // .fontWeight(FontWeight.Bold)//加粗

            }
          }
          .margin({top:-10})
          .onClick(() => {
            console.info(`Succeeded in clicking the 'Next' button.`)
            // 跳转
            router.pushUrl({ url: 'pages/hanhua' }).then(() => {
              console.info('Succeeded in jumping to the second page.')

            }).catch((err: BusinessError) => {
              console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
            })
          })
        }
        .margin({top:40})


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
        .margin({ top: 392, left: 5 })
        .justifyContent(FlexAlign.SpaceBetween) // 等间距分布
      }
      .width('100%')
      .margin({top:20})
    }
    .height('100%')
  }
}