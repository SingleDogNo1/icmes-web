module.exports = {
  base: '',
  root: '/guide',
  title: 'ICMES-WEB',
  lang: 'zh-CN',
  themeConfig: {
    nav: createNav(),
    sidebar: createSidebar(),
  },
};

function createNav() {
  return [
    {
      text: '指南',
      link: '/guide/',
      items: [
        {
          text: '深入',
          link: '/dep/icon',
        },
        {
          text: '其他',
          link: '/other/faq',
        },
      ],
    },
    {
      text: '组件',
      link: '/components/',
      items: [
        {
          text: '介绍',
          link: '/components/introduction',
        },
        {
          text: '全局组件',
          link: '/components/glob/button',
        },
        {
          text: '常用组件',
          link: '/components/basic',
        },
        {
          text: '函数式组件',
          link: '/components/functional/context-menu',
        },
      ],
    },
  ];
}

function createSidebar() {
  return {
    '/components/': [
      {
        text: '组件',
        children: [
          {
            text: '前言',
            link: '/components/introduction',
          },
        ],
      },
      {
        text: '全局组件',
        children: [
          {
            text: 'Button',
            link: '/components/glob/button',
          },
        ],
      },
      {
        text: '常用组件',
        children: [
          {
            text: 'Basic',
            link: '/components/basic',
          },
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
        children: [
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
    ],
    '/': [
      {
        text: '指南',
        children: [
          {
            text: '开始',
            link: '/guide/',
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
        children: [
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
        children: [
          {
            text: '常见问题',
            link: '/other/faq',
          },
        ],
      },
    ],
  };
}
