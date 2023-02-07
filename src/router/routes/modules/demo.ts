// 项目完全由后端控制权限，所以示例路由独立于其他任何菜单存在，且逻辑上需要借用业务路由的逻辑
// 业务菜单名称由后端返回，无需定义 title，示例路由必须添加 meta.title 保证正常渲染标题
// 模拟添加示例权限码，没有实际的业务意义，打包后自动删除示例菜单
const DEMO_MENU_CODE = 17000,
  DEMO_CHILDREN_CODE = 27500;

const demo = {
  path: '/demo',
  name: 'Demo',
  component: 'LAYOUT',
  redirect: '/demo/comp/basic',
  meta: {
    code: DEMO_MENU_CODE,
    icon: 'ion:layers-outline',
    title: '示例',
  },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: 'LAYOUT',
      redirect: '/dashboard/analysis',
      meta: {
        code: DEMO_CHILDREN_CODE,
        icon: 'ion:grid-outline',
        title: 'Dashboard',
      },
      children: [
        {
          path: 'analysis',
          name: 'Analysis',
          component: '/dashboard/analysis/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '分析页',
          },
        },
        {
          path: 'workbench',
          name: 'Workbench',
          component: '/dashboard/workbench/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '工作台',
          },
        },
      ],
    },
    {
      path: 'https://www.antdv.com/components/overview',
      name: 'DocExternal',
      component: 'IFRAME',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '项目文档(外链)',
      },
    },
    {
      path: 'doc',
      name: 'Doc',
      component: 'IFRAME',
      meta: {
        code: DEMO_CHILDREN_CODE,
        frameSrc: 'https://www.antdv.com/components/overview',
        title: '项目文档(内嵌)',
      },
    },

    {
      path: 'page-demo',
      name: 'PageDemo',
      component: 'LAYOUT',
      redirect: '/page-demo/form/basic',
      meta: {
        code: DEMO_CHILDREN_CODE,
        icon: 'ion:aperture-outline',
        title: '页面',
      },
      children: [
        {
          path: 'form',
          name: 'FormPage',
          redirect: '/page-demo/form/basic',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '表单页',
          },
          children: [
            {
              path: 'basic',
              name: 'FormBasicPage',
              component: '/demo/page/form/basic/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '基础表单',
              },
            },
            {
              path: 'step',
              name: 'FormStepPage',
              component: '/demo/page/form/step/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '分步表单',
              },
            },
            {
              path: 'high',
              name: 'FormHightPage',
              component: '/demo/page/form/high/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '高级表单',
              },
            },
          ],
        },
        {
          path: 'desc',
          name: 'DescPage',
          component: 'LAYOUT',
          redirect: '/page-demo/desc/basic',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '详情页',
          },
          children: [
            {
              path: 'basic',
              name: 'DescBasicPage',
              component: '/demo/page/desc/basic/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '基础详情页',
              },
            },
            {
              path: 'high',
              name: 'DescHighPage',
              component: '/demo/page/desc/high/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '高级详情页',
              },
            },
          ],
        },
        {
          path: 'result',
          name: 'ResultPage',
          redirect: '/page-demo/result/success',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '结果页',
          },
          children: [
            {
              path: 'success',
              name: 'ResultSuccessPage',
              component: '/demo/page/result/success/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '成功页',
              },
            },
            {
              path: 'fail',
              name: 'ResultFailPage',
              component: '/demo/page/result/fail/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '失败页',
              },
            },
          ],
        },
        {
          path: 'account',
          name: 'AccountPage',
          component: 'LAYOUT',
          redirect: '/page-demo/account/setting',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '个人页',
          },
          children: [
            {
              path: 'center',
              name: 'DemoAccountCenter',
              component: '/demo/page/account/center/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '个人中心',
              },
            },
          ],
        },
        {
          path: 'exception',
          name: 'ExceptionPage',
          component: 'LAYOUT',
          redirect: '/page-demo/exception/404',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '异常页',
          },
          children: [
            {
              path: '403',
              name: 'PageNotAccess',
              component: '/sys/exception/Exception',
              props: {
                status: 403,
              },
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '403',
              },
            },
            {
              path: '404',
              name: 'PageNotFound',
              component: '/sys/exception/Exception',
              props: {
                status: 404,
              },
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '404',
              },
            },
            {
              path: '500',
              name: 'ServiceError',
              component: '/sys/exception/Exception',
              props: {
                status: 500,
              },
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '500',
              },
            },
            {
              path: 'net-work-error',
              name: 'NetWorkError',
              component: '/sys/exception/Exception',
              props: {
                status: 50000,
              },
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '网络错误',
              },
            },
            {
              path: 'not-data',
              name: 'NotData',
              component: '/sys/exception/Exception',
              props: {
                status: 40400,
              },
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '无数据',
              },
            },
          ],
        },
        {
          path: 'list',
          name: 'ListPage',
          component: 'LAYOUT',
          redirect: '/page-demo/list/card',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '列表页',
          },
          children: [
            {
              path: 'basic',
              name: 'ListBasicPage',
              component: '/demo/page/list/basic/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '标准列表',
              },
            },
            {
              path: 'card',
              name: 'ListCardPage',
              component: '/demo/page/list/card/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '卡片列表',
              },
            },
            {
              path: 'search',
              name: 'ListSearchPage',
              component: '/demo/page/list/search/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '搜索列表',
              },
            },
          ],
        },
      ],
    },

    {
      path: 'setup',
      name: 'SetupDemoPage',
      component: '/demo/setup/index',
      meta: {
        icon: 'whh:paintroll',
        code: DEMO_CHILDREN_CODE,
        title: '引导页',
      },
    },
    {
      path: 'drag-panel',
      name: 'DragPanel',
      component: '/demo/comp/dragPanel/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '可拖拽面板',
      },
    },
    {
      path: 'calendar',
      name: 'CalendarComponent',
      component: '/demo/calendar/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '日历组件',
      },
    },
    {
      path: 'grid-layout',
      name: 'GridLayout',
      component: 'LAYOUT',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '可拖拽网格组件',
      },
      children: [
        {
          path: 'basic',
          name: 'GridLayoutBasic',
          component: '/demo/grid-layout/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '基础示例',
          },
        },
      ],
    },
    {
      path: 'color-picker',
      name: 'ColorPicker',
      component: '/demo/colorPicker/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '取色器',
      },
    },
    {
      path: 'transition',
      name: 'transitionDemo',
      component: '/demo/comp/transition/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '动画组件',
      },
    },
    {
      path: 'modal',
      name: 'ModalDemo',
      component: '/demo/comp/modal/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '弹窗扩展',
      },
    },
    {
      path: 'cropper',
      name: 'CropperDemo',
      component: '/demo/comp/cropper/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '图片裁剪',
      },
    },
    {
      path: 'timestamp',
      name: 'TimeDemo',
      component: '/demo/comp/time/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '相对时间',
      },
    },
    {
      path: 'countTo',
      name: 'CountTo',
      component: '/demo/comp/count-to/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '数字动画',
      },
    },
    {
      path: 'drawer',
      name: 'DrawerDemo',
      component: '/demo/comp/drawer/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '抽屉扩展',
      },
    },
    {
      path: 'desc',
      name: 'DescDemo',
      component: '/demo/comp/desc/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '详情组件',
      },
    },
    {
      path: 'comp',
      name: 'comp',
      component: 'LAYOUT',
      redirect: '/comp/basic',
      meta: {
        code: DEMO_CHILDREN_CODE,
        icon: 'ion:layers-outline',
        title: '组件',
      },
      children: [
        {
          path: 'basic',
          name: 'BasicDemo',
          component: '/demo/comp/button/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '基础组件',
          },
        },
        {
          path: 'qrcode',
          name: 'QrCodeDemo',
          component: '/demo/comp/qrcode/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '二维码组件',
          },
        },
        {
          path: 'image',
          name: 'ImageDemo',
          component: '/demo/comp/image/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '图片组件',
          },
        },
        {
          path: 'strength-meter',
          name: 'StrengthMeterDemo',
          component: '/demo/comp/strength-meter/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '密码强度组件',
          },
        },
        {
          path: 'upload',
          name: 'UploadDemo',
          component: '/demo/comp/upload/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '上传组件',
          },
        },
        {
          path: 'loading',
          name: 'LoadingDemo',
          component: '/demo/comp/loading/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'Loading',
          },
        },
        {
          path: 'cardList',
          name: 'CardListDemo',
          component: '/demo/comp/card-list/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '卡片列表',
          },
        },
        {
          path: 'form',
          name: 'FormDemo',
          redirect: '/comp/form/basic',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            icon: 'mdi:form-select',
            title: 'Form',
          },
          children: [
            {
              path: 'basic',
              name: 'FormBasicDemo',
              component: '/demo/form/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '基础表单',
              },
            },
            {
              path: 'useForm',
              name: 'UseFormDemo',
              component: '/demo/form/UseForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'useForm',
              },
            },
            {
              path: 'refForm',
              name: 'RefFormDemo',
              component: '/demo/form/RefForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'RefForm',
              },
            },
            {
              path: 'advancedForm',
              name: 'AdvancedFormDemo',
              component: '/demo/form/AdvancedForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '可收缩表单',
              },
            },
            {
              path: 'ruleForm',
              name: 'RuleFormDemo',
              component: '/demo/form/RuleForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '表单验证',
              },
            },
            {
              path: 'dynamicForm',
              name: 'DynamicFormDemo',
              component: '/demo/form/DynamicForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '动态表单',
              },
            },
            {
              path: 'customerForm',
              name: 'CustomerFormDemo',
              component: '/demo/form/CustomerForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '自定义组件',
              },
            },
            {
              path: 'appendForm',
              name: 'appendFormDemo',
              component: '/demo/form/AppendForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '表单增删示例',
              },
            },
          ],
        },
        {
          path: 'table',
          name: 'TableDemo',
          redirect: '/comp/table/basic',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            icon: 'carbon:table-split',
            title: 'Table',
          },
          children: [
            {
              path: 'basic',
              name: 'TableBasicDemo',
              component: '/demo/table/Basic',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '基础表格',
              },
            },
            {
              path: 'treeTable',
              name: 'TreeTableDemo',
              component: '/demo/table/TreeTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '树形表格',
              },
            },
            {
              path: 'fetchTable',
              name: 'FetchTableDemo',
              component: '/demo/table/FetchTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '远程加载示例',
              },
            },
            {
              path: 'fixedColumn',
              name: 'FixedColumnDemo',
              component: '/demo/table/FixedColumn',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '固定列',
              },
            },
            {
              path: 'customerCell',
              name: 'CustomerCellDemo',
              component: '/demo/table/CustomerCell',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '自定义列',
              },
            },
            {
              path: 'formTable',
              name: 'FormTableDemo',
              component: '/demo/table/FormTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '开启搜索区域',
              },
            },
            {
              path: 'useTable',
              name: 'UseTableDemo',
              component: '/demo/table/UseTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'UseTable',
              },
            },
            {
              path: 'refTable',
              name: 'RefTableDemo',
              component: '/demo/table/RefTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'RefTable',
              },
            },
            {
              path: 'multipleHeader',
              name: 'MultipleHeaderDemo',
              component: '/demo/table/MultipleHeader',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '多级表头',
              },
            },
            {
              path: 'mergeHeader',
              name: 'MergeHeaderDemo',
              component: '/demo/table/MergeHeader',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '合并单元格',
              },
            },
            {
              path: 'expandTable',
              name: 'ExpandTableDemo',
              component: '/demo/table/ExpandTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '可展开表格',
              },
            },
            {
              path: 'fixedHeight',
              name: 'FixedHeightDemo',
              component: '/demo/table/FixedHeight',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '定高/头部自定义',
              },
            },
            {
              path: 'footerTable',
              name: 'FooterTableDemo',
              component: '/demo/table/FooterTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '表尾行合计',
              },
            },
            {
              path: 'editCellTable',
              name: 'EditCellTableDemo',
              component: '/demo/table/EditCellTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '可编辑单元格',
              },
            },
            {
              path: 'editRowTable',
              name: 'EditRowTableDemo',
              component: '/demo/table/EditRowTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '可编辑行',
              },
            },
            {
              path: 'formInTable',
              name: 'FormInTableDemo',
              component: '/demo/table/formInTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '表格嵌套表单',
              },
            },
            {
              path: 'authColumn',
              name: 'AuthColumnDemo',
              component: '/demo/table/AuthColumn',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '权限列',
              },
            },
            {
              path: 'resizeParentHeightTable',
              name: 'ResizeParentHeightTable',
              component: '/demo/table/ResizeParentHeightTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '继承父元素高度',
              },
            },
          ],
        },
        {
          path: 'tree',
          name: 'TreeDemo',
          redirect: '/demo/comp/tree/basic',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            icon: 'clarity:tree-view-line',
            title: 'Tree',
          },
          children: [
            {
              path: 'basic',
              name: 'BasicTreeDemo',
              component: '/demo/tree/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '基础树',
              },
            },
            {
              path: 'editTree',
              name: 'EditTreeDemo',
              component: '/demo/tree/EditTree',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '可搜索/工具栏',
              },
            },
            {
              path: 'actionTree',
              name: 'ActionTreeDemo',
              component: '/demo/tree/ActionTree',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '函数操作示例',
              },
            },
          ],
        },
        {
          path: 'lazy',
          name: 'LazyDemo',
          component: 'LAYOUT',
          redirect: '/comp/lazy/basic',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '懒加载组件',
          },
          children: [
            {
              path: 'basic',
              name: 'BasicLazyDemo',
              component: '/demo/comp/lazy/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '基础示例',
              },
            },
            {
              path: 'transition',
              name: 'BasicTransitionDemo',
              component: '/demo/comp/lazy/Transition',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '动画效果',
              },
            },
          ],
        },
        {
          path: 'verify',
          name: 'VerifyDemo',
          component: 'LAYOUT',
          redirect: '/comp/verify/drag',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '验证组件',
          },
          children: [
            {
              path: 'drag',
              name: 'VerifyDragDemo',
              component: '/demo/comp/verify/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '拖拽校验',
              },
            },
            {
              path: 'rotate',
              name: 'VerifyRotateDemo',
              component: '/demo/comp/verify/Rotate',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '图片还原',
              },
            },
          ],
        },
      ],
    },
    {
      path: 'feat',
      name: 'FeatDemo',
      component: 'LAYOUT',
      redirect: '/feat/icon',
      meta: {
        code: DEMO_CHILDREN_CODE,
        icon: 'ion:git-compare-outline',
        title: '功能',
      },
      children: [
        {
          path: 'icon',
          name: 'IconDemo',
          component: '/demo/feat/icon/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '图标',
          },
        },
        {
          path: 'ws',
          name: 'WebSocket',
          component: '/demo/feat/ws/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'websocket测试',
          },
        },
        {
          path: 'session-timeout',
          name: 'SessionTimeout',
          component: '/demo/feat/session-timeout/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '登录过期',
          },
        },
        {
          path: 'print',
          name: 'Print',
          component: '/demo/feat/print/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '打印',
          },
        },
        {
          path: 'tabs',
          name: 'TabsDemo',
          component: '/demo/feat/tabs/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '标签页操作',
          },
        },
        {
          path: 'breadcrumb',
          name: 'BreadcrumbDemo',
          redirect: '/feat/breadcrumb/flat',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '面包屑导航',
          },
          children: [
            {
              path: 'flat',
              name: 'BreadcrumbFlatDemo',
              component: '/demo/feat/breadcrumb/FlatList',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '平级模式',
              },
            },
            {
              path: 'flatDetail',
              name: 'BreadcrumbFlatDetailDemo',
              component: '/demo/feat/breadcrumb/FlatListDetail',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '平级详情',
                hideMenu: true,
                hideTab: true,
                currentActiveMenu: '/feat/breadcrumb/flat',
              },
            },
            {
              path: 'children',
              name: 'BreadcrumbChildrenDemo',
              component: '/demo/feat/breadcrumb/ChildrenList',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '层级模式',
              },
              children: [
                {
                  path: 'childrenDetail',
                  name: 'BreadcrumbChildrenDetailDemo',
                  component: '/demo/feat/breadcrumb/ChildrenListDetail',
                  meta: {
                    code: DEMO_CHILDREN_CODE,
                    currentActiveMenu: '/feat/breadcrumb/children',
                    title: '层级详情',
                  },
                },
              ],
            },
          ],
        },
        {
          path: 'context-menu',
          name: 'ContextMenuDemo',
          component: '/demo/feat/context-menu/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '右键菜单',
          },
        },
        {
          path: 'download',
          name: 'DownLoadDemo',
          component: '/demo/feat/download/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '文件下载',
          },
        },
        {
          path: 'click-out-side',
          name: 'ClickOutSideDemo',
          component: '/demo/feat/click-out-side/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'ClickOutSide组件',
          },
        },
        {
          path: 'img-preview',
          name: 'ImgPreview',
          component: '/demo/feat/img-preview/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '图片预览',
          },
        },
        {
          path: 'copy',
          name: 'CopyDemo',
          component: '/demo/feat/copy/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '剪切板',
          },
        },
        {
          path: 'msg',
          name: 'MsgDemo',
          component: '/demo/feat/msg/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '消息提示',
          },
        },
        {
          path: 'watermark',
          name: 'WatermarkDemo',
          component: '/demo/feat/watermark/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '水印',
          },
        },
        {
          path: 'ripple',
          name: 'RippleDemo',
          component: '/demo/feat/ripple/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '水波纹',
          },
        },
        {
          path: 'full-screen',
          name: 'FullScreenDemo',
          component: '/demo/feat/full-screen/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '全屏',
          },
        },
        {
          path: 'error-log',
          name: 'ErrorLog',
          component: '/sys/error-log/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '错误日志',
          },
        },
        {
          path: 'excel',
          name: 'Excel',
          redirect: '/feat/excel/customExport',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            icon: 'mdi:microsoft-excel',
            title: 'Excel',
          },

          children: [
            {
              path: 'customExport',
              name: 'CustomExport',
              component: '/demo/excel/CustomExport',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '选择导出格式',
              },
            },
            {
              path: 'jsonExport',
              name: 'JsonExport',
              component: '/demo/excel/JsonExport',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'JSON数据导出',
              },
            },
            {
              path: 'arrayExport',
              name: 'ArrayExport',
              component: '/demo/excel/ArrayExport',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'Array数据导出',
              },
            },
            {
              path: 'importExcel',
              name: 'ImportExcel',
              component: '/demo/excel/ImportExcel',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '导入',
              },
            },
          ],
        },
        {
          path: 'testTab/:id',
          name: 'TestTab',
          component: '/demo/feat/tab-params/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'Tab带参',
            carryParam: true,
            hidePathForChildren: true,
          },
          children: [
            {
              path: 'testTab/id1',
              name: 'TestTab1',
              component: '/demo/feat/tab-params/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'Tab带参1',
                carryParam: true,
                ignoreRoute: true,
              },
            },
            {
              path: 'testTab/id2',
              name: 'TestTab2',
              component: '/demo/feat/tab-params/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'Tab带参2',
                carryParam: true,
                ignoreRoute: true,
              },
            },
          ],
        },
        {
          path: 'testParam/:id',
          name: 'TestParam',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'Menu带参',
            ignoreKeepAlive: true,
          },
          children: [
            {
              path: 'sub1',
              name: 'TestParam_1',
              component: '/demo/feat/menu-params/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'Menu带参1',
                ignoreKeepAlive: true,
              },
            },
            {
              path: 'sub2',
              name: 'TestParam_2',
              component: '/demo/feat/menu-params/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'Menu带参2',
                ignoreKeepAlive: true,
              },
            },
          ],
        },
      ],
    },
    {
      path: 'flow',
      name: 'FlowDemo',
      component: 'LAYOUT',
      redirect: '/flow/flowChart',
      meta: {
        code: DEMO_CHILDREN_CODE,
        icon: 'tabler:chart-dots',
        title: '图形编辑器',
      },
      children: [
        {
          path: 'flowChart',
          name: 'flowChartDemo',
          component: '/demo/comp/flow-chart/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '流程图',
          },
        },
      ],
    },
    {
      path: 'charts',
      name: 'Charts',
      component: 'LAYOUT',
      redirect: '/charts/echarts/map',
      meta: {
        code: DEMO_CHILDREN_CODE,
        icon: 'ion:bar-chart-outline',
        title: '图表',
      },
      children: [
        {
          path: 'baiduMap',
          name: 'BaiduMap',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '百度地图',
          },
          component: '/demo/charts/map/Baidu',
        },
        {
          path: 'aMap',
          name: 'AMap',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '高德地图',
          },
          component: '/demo/charts/map/Gaode',
        },
        {
          path: 'googleMap',
          name: 'GoogleMap',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '谷歌地图',
          },
          component: '/demo/charts/map/Google',
        },
        {
          path: 'echarts',
          name: 'Echarts',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'Echarts',
          },
          redirect: '/charts/echarts/map',
          children: [
            {
              path: 'map',
              name: 'Map',
              component: '/demo/charts/Map',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '地图',
              },
            },
            {
              path: 'line',
              name: 'Line',
              component: '/demo/charts/Line',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '折线图',
              },
            },
            {
              path: 'pie',
              name: 'Pie',
              component: '/demo/charts/Pie',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '饼图',
              },
            },
          ],
        },
      ],
    },
    {
      path: 'editor',
      name: 'EditorDemo',
      redirect: '/editor/markdown',
      component: 'LAYOUT',
      meta: {
        code: DEMO_CHILDREN_CODE,
        icon: 'carbon:table-split',
        title: '编辑器',
      },
      children: [
        {
          path: 'json',
          component: '/demo/editor/json/index',
          name: 'JsonEditorDemo',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'Json编辑器',
          },
        },
        {
          path: 'markdown',
          component: 'LAYOUT',
          name: 'MarkdownDemo',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'markdown编辑器',
          },
          redirect: '/editor/markdown/index',
          children: [
            {
              path: 'index',
              name: 'MarkDownBasicDemo',
              component: '/demo/editor/markdown/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '富文本',
              },
            },
            {
              path: 'editor',
              name: 'MarkDownFormDemo',
              component: '/demo/editor/markdown/Editor',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '嵌入form',
              },
            },
          ],
        },
        {
          path: 'tinymce',
          component: 'LAYOUT',
          name: 'TinymceDemo',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '富文本',
          },
          redirect: '/editor/tinymce/index',
          children: [
            {
              path: 'index',
              name: 'TinymceBasicDemo',
              component: '/demo/editor/tinymce/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '基础使用',
              },
            },
            {
              path: 'editor',
              name: 'TinymceFormDemo',
              component: '/demo/editor/tinymce/Editor',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: '嵌入form',
              },
            },
          ],
        },
      ],
    },
    {
      path: 'scroll',
      name: 'ScrollDemo',
      redirect: '/demo/scroll/basic',
      component: 'LAYOUT',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: '滚动组件',
      },
      children: [
        {
          path: 'basic',
          name: 'BasicScrollDemo',
          component: '/demo/comp/scroll/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '基础滚动',
          },
        },
        {
          path: 'action',
          name: 'ActionScrollDemo',
          component: '/demo/comp/scroll/Action',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '滚动函数',
          },
        },
        {
          path: 'virtualScroll',
          name: 'VirtualScrollDemo',
          component: '/demo/comp/scroll/VirtualScroll',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: '虚拟滚动',
          },
        },
      ],
    },
  ],
};

export default demo;
