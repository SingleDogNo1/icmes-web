import type { ProjectConfig } from '/#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/enums/appEnum';
import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting';
import { primaryColor } from '../../build/config/themeConfig';

// ! 更改后需要清除浏览器缓存并重启应用生效
const setting: ProjectConfig = {
  // 是否显示配置按钮
  showSettingButton: true,

  // 是否显示切换主题按钮
  showDarkModeToggle: true,

  // 设置按钮的位置
  settingButtonPosition: SettingButtonPositionEnum.AUTO,

  // ! 权限模式(该项目为后台权限, 严禁改动)
  permissionMode: PermissionModeEnum.BACK,

  // 与权限相关的缓存保存在 localStorage 还是 sessionStorage
  permissionCacheType: CacheTypeEnum.LOCAL,

  // session 超时操作
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // 系统主题色
  themeColor: primaryColor,

  // 是否为灰色模式(纪念南京大屠杀等重大事件时打开)
  grayMode: false,

  // 是否开启色弱模式
  colorWeak: false,

  // 是否取消菜单 & 顶部 & 标签页的显示(如果可能嵌入到其他系统中需要开启)
  fullContent: false,

  // 内容区域显示模式
  contentMode: ContentEnum.FULL,

  // 是否显示 logo
  showLogo: true,

  // 是否显示页脚
  showFooter: false,

  // 导航栏配置项
  headerSetting: {
    // 导航栏背景色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],

    // 是否使用 fixed 固定导航栏
    fixed: true,

    // 是否显示导航栏
    show: true,

    // 导航栏主题
    theme: ThemeEnum.LIGHT,

    // 是否显示锁屏按钮
    useLockPage: false,

    // 是否显示全屏按钮
    showFullScreen: true,

    // 是否显示文档按钮
    showDoc: false,

    // 是否显示通知按钮
    showNotice: true,

    // 是否显示搜索按钮
    showSearch: true,
  },

  // 目录配置项
  menuSetting: {
    // 目录背景色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],

    //  是否使用 fixed 固定目录
    fixed: true,

    // 是否折叠目录
    collapsed: false,

    // 折叠目录时,是否显示网站标题
    collapsedShowTitle: false,

    // 是否可以拖动(仅限于目录未折叠时生效,菜单栏右侧会出现可拖拽的区域)
    canDrag: false,

    // 是否显示目录
    show: true,

    // 是否隐藏目录
    hidden: false,

    // 侧边栏宽度
    menuWidth: 210,

    // 侧边栏模式
    mode: MenuModeEnum.INLINE,

    // 菜单类型
    type: MenuTypeEnum.SIDEBAR,

    // 菜单主题
    theme: ThemeEnum.DARK,

    // 分割菜单
    split: false,

    // 菜单顶部布局
    topMenuAlign: 'center',

    // 折叠菜单按钮的位置
    trigger: TriggerEnum.HEADER,

    // 是否开启手风琴模式
    accordion: true,

    // 将页面切换到关闭菜单
    closeMixSidebarOnChange: false,

    // 打开目录选项的方式
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,

    // 是否固定展开的菜单
    mixSideFixed: false,
  },

  // 多标签导航配置项
  multiTabsSetting: {
    // 是否缓存
    cache: false,

    // 是否显示
    show: true,

    // 是否可以拖放 tab
    canDrag: true,

    //  是否使用侧快捷操作
    showQuick: true,

    // 是否显示刷新按钮
    showRedo: true,

    // 是否显示折叠按钮
    showFold: true,
  },

  // 过渡效果设置
  transitionSetting: {
    // 是否启用过渡效果
    enable: true,

    // 路由切换时的过渡效果
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // 打开页面时是否显示加载动画
    openPageLoading: true,

    // 是否使用顶部进度条
    openNProgress: false,
  },

  // 是否启用KeepAlive缓存(最好在开发过程中关闭，否则每次都需要清除缓存)
  openKeepAlive: true,

  // 自动屏幕锁定时间，0 表示不锁定屏幕。单位分钟, 默认值 0
  lockTime: 0,

  // 是否显示面包屑导航
  showBreadCrumb: true,

  // 是否显示面包屑导航图标
  showBreadCrumbIcon: false,

  // 是否启用捕捉异常工具
  useErrorHandle: false,

  // 是否使用返回顶部功能
  useOpenBackTop: true,

  // 是否可以嵌入 iframe 框架
  canEmbedIFramePage: true,

  // 切换标签时是否删除正在显示的消息(message)和通知(notify)
  closeMessageOnSwitch: true,

  // 切换界面的时候是否取消已经发送但是未响应的http请求。
  // 如果开启,想对单独接口覆盖。可以在单独接口设置
  removeAllHttpPending: false,
};

export default setting;
