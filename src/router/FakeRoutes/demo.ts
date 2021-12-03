import { BackModeRouteRecordRaw } from '/@/router/types';

// 模拟添加示例权限码，没有实际的业务意义，打包后自动删除示例菜单
const DEMO_MENU_CODE = 17000,
  DEMO_CHILDREN_CODE = 27500;

const demo: BackModeRouteRecordRaw = {
  path: '/demo',
  name: 'Demo',
  component: 'LAYOUT',
  redirect: '/demo/comp/basic',
  meta: {
    code: DEMO_MENU_CODE,
    icon: 'ion:layers-outline',
    title: 'routes.demo.title',
  },
  children: [
    {
      path: 'https://2x.antdv.com/components/icon-cn',
      name: 'DocExternal',
      component: 'IFRAME',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.iframe.docExternal',
      },
    },
    {
      path: 'doc',
      name: 'Doc',
      component: 'IFRAME',
      meta: {
        code: DEMO_CHILDREN_CODE,
        frameSrc: 'https://2x.antdv.com/components/icon-cn',
        title: 'routes.demo.iframe.doc',
      },
    },
    {
      path: 'setup',
      name: 'SetupDemoPage',
      component: '/demo/setup/index',
      meta: {
        icon: 'whh:paintroll',
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.setup.page',
      },
    },
    {
      path: 'drag-panel',
      name: 'DragPanel',
      component: '/demo/comp/dragPanel/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.dragPanel',
      },
    },
    {
      path: 'transition',
      name: 'transitionDemo',
      component: '/demo/comp/transition/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.transition',
      },
    },
    {
      path: 'modal',
      name: 'ModalDemo',
      component: '/demo/comp/modal/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.modal',
      },
    },
    {
      path: 'cropper',
      name: 'CropperDemo',
      component: '/demo/comp/cropper/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.cropperImage',
      },
    },
    {
      path: 'timestamp',
      name: 'TimeDemo',
      component: '/demo/comp/time/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.time',
      },
    },
    {
      path: 'countTo',
      name: 'CountTo',
      component: '/demo/comp/count-to/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.countTo',
      },
    },
    {
      path: 'drawer',
      name: 'DrawerDemo',
      component: '/demo/comp/drawer/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.drawer',
      },
    },
    {
      path: 'desc',
      name: 'DescDemo',
      component: '/demo/comp/desc/index',
      meta: {
        code: DEMO_CHILDREN_CODE,
        title: 'routes.demo.comp.desc',
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
        title: 'routes.demo.comp.comp',
      },
      children: [
        {
          path: 'basic',
          name: 'BasicDemo',
          component: '/demo/comp/button/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.basic',
          },
        },
        {
          path: 'qrcode',
          name: 'QrCodeDemo',
          component: '/demo/comp/qrcode/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.qrcode',
          },
        },
        {
          path: 'strength-meter',
          name: 'StrengthMeterDemo',
          component: '/demo/comp/strength-meter/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.strength',
          },
        },
        {
          path: 'upload',
          name: 'UploadDemo',
          component: '/demo/comp/upload/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.upload',
          },
        },
        {
          path: 'loading',
          name: 'LoadingDemo',
          component: '/demo/comp/loading/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.loading',
          },
        },
        {
          path: 'cardList',
          name: 'CardListDemo',
          component: '/demo/comp/card-list/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.cardList',
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
            title: 'routes.demo.form.form',
          },
          children: [
            {
              path: 'basic',
              name: 'FormBasicDemo',
              component: '/demo/form/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.basic',
              },
            },
            {
              path: 'useForm',
              name: 'UseFormDemo',
              component: '/demo/form/UseForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.useForm',
              },
            },
            {
              path: 'refForm',
              name: 'RefFormDemo',
              component: '/demo/form/RefForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.refForm',
              },
            },
            {
              path: 'advancedForm',
              name: 'AdvancedFormDemo',
              component: '/demo/form/AdvancedForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.advancedForm',
              },
            },
            {
              path: 'ruleForm',
              name: 'RuleFormDemo',
              component: '/demo/form/RuleForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.ruleForm',
              },
            },
            {
              path: 'dynamicForm',
              name: 'DynamicFormDemo',
              component: '/demo/form/DynamicForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.dynamicForm',
              },
            },
            {
              path: 'customerForm',
              name: 'CustomerFormDemo',
              component: '/demo/form/CustomerForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.customerForm',
              },
            },
            {
              path: 'appendForm',
              name: 'appendFormDemo',
              component: '/demo/form/AppendForm',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.form.appendForm',
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
            title: 'routes.demo.table.table',
          },
          children: [
            {
              path: 'basic',
              name: 'TableBasicDemo',
              component: '/demo/table/Basic',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.basic',
              },
            },
            {
              path: 'treeTable',
              name: 'TreeTableDemo',
              component: '/demo/table/TreeTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.treeTable',
              },
            },
            {
              path: 'fetchTable',
              name: 'FetchTableDemo',
              component: '/demo/table/FetchTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.fetchTable',
              },
            },
            {
              path: 'fixedColumn',
              name: 'FixedColumnDemo',
              component: '/demo/table/FixedColumn',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.fixedColumn',
              },
            },
            {
              path: 'customerCell',
              name: 'CustomerCellDemo',
              component: '/demo/table/CustomerCell',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.customerCell',
              },
            },
            {
              path: 'formTable',
              name: 'FormTableDemo',
              component: '/demo/table/FormTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.formTable',
              },
            },
            {
              path: 'useTable',
              name: 'UseTableDemo',
              component: '/demo/table/UseTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.useTable',
              },
            },
            {
              path: 'refTable',
              name: 'RefTableDemo',
              component: '/demo/table/RefTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.refTable',
              },
            },
            {
              path: 'multipleHeader',
              name: 'MultipleHeaderDemo',
              component: '/demo/table/MultipleHeader',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.multipleHeader',
              },
            },
            {
              path: 'mergeHeader',
              name: 'MergeHeaderDemo',
              component: '/demo/table/MergeHeader',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.mergeHeader',
              },
            },
            {
              path: 'expandTable',
              name: 'ExpandTableDemo',
              component: '/demo/table/ExpandTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.expandTable',
              },
            },
            {
              path: 'fixedHeight',
              name: 'FixedHeightDemo',
              component: '/demo/table/FixedHeight',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.fixedHeight',
              },
            },
            {
              path: 'footerTable',
              name: 'FooterTableDemo',
              component: '/demo/table/FooterTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.footerTable',
              },
            },
            {
              path: 'editCellTable',
              name: 'EditCellTableDemo',
              component: '/demo/table/EditCellTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.editCellTable',
              },
            },
            {
              path: 'editRowTable',
              name: 'EditRowTableDemo',
              component: '/demo/table/EditRowTable',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.editRowTable',
              },
            },
            {
              path: 'authColumn',
              name: 'AuthColumnDemo',
              component: '/demo/table/AuthColumn',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.table.authColumn',
              },
            },
          ],
        },
        {
          path: 'tree',
          name: 'TreeDemo',
          redirect: '/comp/tree/basic',
          component: 'LAYOUT',
          meta: {
            code: DEMO_CHILDREN_CODE,
            icon: 'clarity:tree-view-line',
            title: 'routes.demo.comp.tree',
          },
          children: [
            {
              path: 'basic',
              name: 'BasicTreeDemo',
              component: '/demo/tree/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.comp.treeBasic',
              },
            },
            {
              path: 'editTree',
              name: 'EditTreeDemo',
              component: '/demo/tree/EditTree',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.comp.editTree',
              },
            },
            {
              path: 'actionTree',
              name: 'ActionTreeDemo',
              component: '/demo/tree/ActionTree',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.comp.actionTree',
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
            title: 'routes.demo.comp.lazy',
          },
          children: [
            {
              path: 'basic',
              name: 'BasicLazyDemo',
              component: '/demo/comp/lazy/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.comp.lazyBasic',
              },
            },
            {
              path: 'transition',
              name: 'BasicTransitionDemo',
              component: '/demo/comp/lazy/Transition',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.comp.lazyTransition',
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
            title: 'routes.demo.comp.verify',
          },
          children: [
            {
              path: 'drag',
              name: 'VerifyDragDemo',
              component: '/demo/comp/verify/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.comp.verifyDrag',
              },
            },
            {
              path: 'rotate',
              name: 'VerifyRotateDemo',
              component: '/demo/comp/verify/Rotate',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.comp.verifyRotate',
              },
            },
          ],
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
        title: 'routes.demo.charts.charts',
      },
      children: [
        {
          path: 'baiduMap',
          name: 'BaiduMap',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.charts.baiduMap',
          },
          component: '/demo/charts/map/Baidu',
        },
        {
          path: 'aMap',
          name: 'AMap',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.charts.aMap',
          },
          component: '/demo/charts/map/Gaode',
        },
        {
          path: 'googleMap',
          name: 'GoogleMap',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.charts.googleMap',
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
                title: 'routes.demo.charts.map',
              },
            },
            {
              path: 'line',
              name: 'Line',
              component: '/demo/charts/Line',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.charts.line',
              },
            },
            {
              path: 'pie',
              name: 'Pie',
              component: '/demo/charts/Pie',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.charts.pie',
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
        title: 'routes.demo.editor.editor',
      },
      children: [
        {
          path: 'json',
          component: '/demo/editor/json/index',
          name: 'JsonEditorDemo',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.editor.jsonEditor',
          },
        },
        {
          path: 'markdown',
          component: 'LAYOUT',
          name: 'MarkdownDemo',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.editor.markdown',
          },
          redirect: '/editor/markdown/index',
          children: [
            {
              path: 'index',
              name: 'MarkDownBasicDemo',
              component: '/demo/editor/markdown/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.editor.tinymceBasic',
              },
            },
            {
              path: 'editor',
              name: 'MarkDownFormDemo',
              component: '/demo/editor/markdown/Editor',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.editor.tinymceForm',
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
            title: 'routes.demo.editor.tinymce',
          },
          redirect: '/editor/tinymce/index',
          children: [
            {
              path: 'index',
              name: 'TinymceBasicDemo',
              component: '/demo/editor/tinymce/index',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.editor.tinymceBasic',
              },
            },
            {
              path: 'editor',
              name: 'TinymceFormDemo',
              component: '/demo/editor/tinymce/Editor',
              meta: {
                code: DEMO_CHILDREN_CODE,
                title: 'routes.demo.editor.tinymceForm',
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
        title: 'routes.demo.comp.scroll',
      },
      children: [
        {
          path: 'basic',
          name: 'BasicScrollDemo',
          component: '/demo/comp/scroll/index',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.scrollBasic',
          },
        },
        {
          path: 'action',
          name: 'ActionScrollDemo',
          component: '/demo/comp/scroll/Action',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.scrollAction',
          },
        },
        {
          path: 'virtualScroll',
          name: 'VirtualScrollDemo',
          component: '/demo/comp/scroll/VirtualScroll',
          meta: {
            code: DEMO_CHILDREN_CODE,
            title: 'routes.demo.comp.virtualScroll',
          },
        },
      ],
    },
  ],
};

export default demo;
