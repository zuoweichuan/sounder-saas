import { router, ComposeTitleBar, promptAction, ComposeTitleBarMenuItem } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { getCurrentTempx, getCurrentTempy, boolset, boolget, getcolor1, setcolor1, getcolor2, setcolor2,
  getcolorused1, setcolorused1, getcolorused2, setcolorused2, getcolorused3, setcolorused3, getcolorused4, setcolorused4 } from '../global';
import { ApiService } from '../utils/ApiService';

@Entry
@Component
struct UserProfile {
  @State message: string = '';
  @State userName: string = '西南小天才'; // 默认值，将从API获取
  @State companyName: string = ''; // 将从API获取
  @State subscriptionPlan: string = ''; // 将从API获取
  private apiService: ApiService = ApiService.getInstance();

  aboutToAppear() {
    // 页面加载时尝试获取用户和租户信息
    this.loadUserData();
  }

  async loadUserData() {
    try {
      // 检查用户数据是否已加载
      const userData = this.apiService.getUserData();
      const tenantData = this.apiService.getTenantData();
      
      if (userData) {
        this.userName = userData.name;
      }
      
      if (tenantData) {
        this.companyName = tenantData.companyName || tenantData.name;
        this.subscriptionPlan = this.getSubscriptionPlanName(tenantData.subscriptionPlan);
      } else {
        // 如果没有租户数据，尝试获取
        const result = await this.apiService.getCurrentTenant();
        if (result && result.tenant) {
          this.companyName = result.tenant.companyName || result.tenant.name;
          this.subscriptionPlan = this.getSubscriptionPlanName(result.tenant.subscriptionPlan);
        }
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      promptAction.showToast({ message: '加载用户数据失败' });
    }
  }

  // 将订阅计划ID转换为显示名称
  getSubscriptionPlanName(planId: string): string {
    switch (planId) {
      case 'basic': return '基础版';
      case 'standard': return '标准版';
      case 'premium': return '高级版';
      default: return '未知';
    }
  }

  build() {
    Column() {
      Row() {
        Column() {
          ComposeTitleBar({
            title: "我的"
          })
            .onClick(() => {
              console.info(`Succeeded in clicking the 'Next' button.`)
              router.pushUrl({ url: 'pages/main' }).then(() => {
                console.info('Succeeded in jumping to the main page.')
              }).catch((err: BusinessError) => {
                console.error(`Failed to jump to the main page. Code is ${err.code}, message is ${err.message}`)
              })
            })
        }
      }

      Row() {
        Image($r('app.media.img5'))
          .height(50)
          .width(50)
          .margin({left: 0, top: 20})
        Image($r('app.media.img4'))
          .height(50)
          .width(150)
          .margin({left: 50, top: 20})
      }

      Column() {
        Row() {
          SymbolGlyph($r('sys.symbol.person_filled_viewfinder'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 10})
            .fontColor(['#6fcfeb'])

          Text(`账户：${this.userName}`)
            .fontSize(22)
            .margin({left: 10})
            .fontWeight(FontWeight.Bold)

          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 60})
        }
        .backgroundColor('#e6f4f6')
        .width('90%')
        .height(40)
        .margin({top: 0})
        .borderRadius(8)
        .onClick(() => {
          // 可以跳转到用户资料编辑页面
          promptAction.showToast({ message: '用户资料功能开发中' });
        })

        Row() {
          SymbolGlyph($r('sys.symbol.building_2_fill'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 10})
            .fontColor(['#6fcfeb'])

          Text(`企业：${this.companyName}`)
            .fontSize(22)
            .margin({left: 10})
            .fontWeight(FontWeight.Bold)

          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 60})
        }
        .backgroundColor('#e6f4f6')
        .width('90%')
        .height(40)
        .margin({top: 20})
        .borderRadius(8)
        .onClick(() => {
          // 可以跳转到企业信息页面
          promptAction.showToast({ message: '企业信息功能开发中' });
        })

        Row() {
          SymbolGlyph($r('sys.symbol.crown_fill'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 10})
            .fontColor(['#6fcfeb'])

          Text(`订阅版本：${this.subscriptionPlan}`)
            .fontSize(22)
            .margin({left: 10})
            .fontWeight(FontWeight.Bold)

          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 30})
        }
        .backgroundColor('#e6f4f6')
        .width('90%')
        .height(40)
        .margin({top: 20})
        .borderRadius(8)
        .onClick(() => {
          // 跳转到订阅管理页面
          router.pushUrl({ url: 'pages/subscription' }).catch((err: BusinessError) => {
            console.error(`Failed to navigate: ${err.message}`);
            promptAction.showToast({ message: '订阅管理功能开发中' });
          });
        })

        Row() {
          SymbolGlyph($r('sys.symbol.hand_point_up_tap_fill_1'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 10})
            .fontColor(['#6fcfeb'])

          Text('相关信息')
            .fontSize(22)
            .margin({left: 10})
            .fontWeight(FontWeight.Bold)

          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontWeight(FontWeight.Lighter)
            .fontSize(30)
            .margin({left: 150})
        }
        .backgroundColor('#e6f4f6')
        .width('90%')
        .margin({top: 20})
        .borderRadius(8)
        .height(40)
        .onClick(() => {
          promptAction.showToast({ message: '相关信息功能开发中' });
        })

        // 底部导航栏
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
                router.pushUrl({ url: 'pages/Index' }).then(() => {
                  console.info('Succeeded in jumping to Index page.')
                }).catch((err: BusinessError) => {
                  console.error(`Failed to jump to Index page. Code is ${err.code}, message is ${err.message}`)
                })
              })
              .overlay('首页', { align: Alignment.Bottom, offset: { x: 0, y: 15 } })
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
                router.pushUrl({ url: 'pages/first' }).then(() => {
                  console.info('Succeeded in jumping to service page.')
                }).catch((err: BusinessError) => {
                  console.error(`Failed to jump to service page. Code is ${err.code}, message is ${err.message}`)
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
                router.pushUrl({ url: 'pages/second' }).then(() => {
                  console.info('Succeeded in jumping to warning page.')
                }).catch((err: BusinessError) => {
                  console.error(`Failed to jump to warning page. Code is ${err.code}, message is ${err.message}`)
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
              })
          }
          .layoutWeight(1)
        }
        .width('100%')
        .height(30)
        .margin({ top: 390, left: 5 })
        .justifyContent(FlexAlign.SpaceBetween)
      }
      .width('100%')
      .margin({top: 20})
    }
    .height('100%')
  }
}
