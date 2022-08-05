export default {
  title: 'VitePress',
  description: 'Just playing around.',
  themeConfig: {
    siteTitle: 'ICMES 开发文档',
    search: false,
    searchMaxSuggestions: 10,
    editLink: {
      // pattern: 'https://github.com/lost-dream/icmes-web/edit/main/docs/src/:path', // github
      pattern: 'http://192.168.88.79:8081/ZHAOCHENMIN/icmes-web-new/edit/main/docs/src/:path', // gitlab
    },
    nav: [
      {
        text: '指南',
        link: '/guide/',
      },
      {
        text: '组件',
        link: '/components/introduction',
      },
    ],
    sidebar: {
      '/guide/': genGuideSidebar(),
      '/dep/': genGuideSidebar(),
      '/other/': genGuideSidebar(),
      '/components/': genComponentsSidebar(),
    },
  },
};

function genGuideSidebar() {
  return [
    {
      text: '指南',
      items: [
        {
          text: '开始',
          link: '/guide/',
        },
        {
          text: '为什么是 hooks',
          link: '/guide/hooks',
        },
        {
          text: '项目配置',
          link: '/guide/settings',
        },
        {
          text: '路由',
          link: '/guide/router',
        },
        {
          text: '菜单',
          link: '/guide/menu',
        },
        {
          text: '权限',
          link: '/guide/auth',
        },
        {
          text: 'Mock&联调',
          link: '/guide/mock',
        },
        {
          text: '组件注册',
          link: '/guide/component',
        },
        {
          text: '样式',
          link: '/guide/design',
        },
        {
          text: '构建&部署',
          link: '/guide/deploy',
        },
      ],
    },
    {
      text: '深入',
      items: [
        {
          text: '图标',
          link: '/dep/icon',
        },
        {
          text: '国际化',
          link: '/dep/i18n',
        },
        {
          text: '项目规范',
          link: '/dep/lint',
        },
        {
          text: '黑暗主题',
          link: '/dep/dark',
        },
      ],
    },
    {
      text: '其他',
      items: [
        {
          text: '常见问题',
          link: '/other/faq',
        },
      ],
    },
  ];
}

function genComponentsSidebar() {
  return [
    {
      text: '',
      items: [
        {
          text: '写在前面',
          link: '/components/introduction',
        },
      ],
    },
    {
      text: '基础组件',
      items: [
        {
          text: 'Button',
          link: '/components/glob/button',
        },
        {
          text: 'Basic',
          link: '/components/basic',
        },
      ],
    },
    {
      text: '常用组件',
      items: [
        {
          text: 'DragPanel',
          link: '/components/drag-panel',
        },
        {
          text: 'ColorPicker',
          link: '/components/color-picker',
        },
        {
          text: 'GridLayout',
          link: '/components/grid-layout',
        },
        {
          text: 'Page',
          link: '/components/page',
        },
        {
          text: 'Icon',
          link: '/components/icon',
        },
        {
          text: 'Authority',
          link: '/components/auth',
        },
        {
          text: 'Form',
          link: '/components/form',
        },
        {
          text: 'Table',
          link: '/components/table',
        },
        {
          text: 'PopConfirmButton',
          link: '/components/pop-confirm-button',
        },
        {
          text: 'CollapseContainer',
          link: '/components/collapse-container',
        },
        {
          text: 'ScrollContainer',
          link: '/components/scroll-container',
        },
        {
          text: 'LazyContainer',
          link: '/components/lazy-container',
        },
        {
          text: 'CodeEditor',
          link: '/components/code-editor',
        },
        {
          text: 'JsonPreview',
          link: '/components/json-preview',
        },
        {
          text: 'CountDown',
          link: '/components/count-down',
        },

        {
          text: 'ClickOutSide',
          link: '/components/click-out-side',
        },
        {
          text: 'CountTo',
          link: '/components/count-to',
        },
        {
          text: 'Cropper',
          link: '/components/cropper',
        },
        {
          text: 'Description',
          link: '/components/desc',
        },
        {
          text: 'Drawer',
          link: '/components/drawer',
        },
        {
          text: 'Modal',
          link: '/components/modal',
        },
        {
          text: 'FlowChart',
          link: '/components/flow-chart',
        },
        {
          text: 'Upload',
          link: '/components/upload',
        },
        {
          text: 'Tree',
          link: '/components/tree',
        },
        {
          text: 'Excel',
          link: '/components/excel',
        },
        {
          text: 'Qrcode',
          link: '/components/qrcode',
        },
        {
          text: 'Markdown',
          link: '/components/markdown',
        },
        {
          text: 'Loading',
          link: '/components/loading',
        },
        {
          text: 'Tinymce',
          link: '/components/tinymce',
        },
        {
          text: 'Time',
          link: '/components/time',
        },
        {
          text: 'StrengthMeter',
          link: '/components/strength-meter',
        },
        {
          text: 'Verify',
          link: '/components/verify',
        },
        {
          text: 'Transition',
          link: '/components/transition',
        },
        {
          text: 'VirtualScroll',
          link: '/components/virtual-scroll',
        },
      ],
    },
    {
      text: '函数式组件',
      items: [
        {
          text: 'ContextMenu',
          link: '/components/functional/context-menu',
        },
        {
          text: 'Loading',
          link: '/components/functional/loading',
        },
        {
          text: 'Preview',
          link: '/components/functional/preview',
        },
      ],
    },
  ];
}
