export default {
  title: 'ICMES',
  description: 'ICMES DOCS',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'ICMES 开发文档',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/lost-dream/icmes-web',
      },
      // TODO 自定义社交图标功能未完善，下版本添加后放开
      // {
      //   icon: {
      //     svg: '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><title>GitLab home page</title><path d="M31.4618 12.7787L31.417 12.6641L27.0667 1.31308C26.9783 1.09046 26.8218 0.90145 26.6197 0.773028C26.416 0.644476 26.1775 0.582308 25.937 0.595107C25.6965 0.607906 25.4659 0.695039 25.277 0.844481C25.0899 0.994513 24.955 1.1998 24.8915 1.43106L21.9503 10.4324H10.0509L7.10976 1.43106C7.04625 1.1998 6.91133 0.994513 6.72425 0.844481C6.53618 0.694035 6.30572 0.606246 6.06523 0.593431C5.82473 0.580616 5.58625 0.64342 5.38326 0.773028C5.18023 0.900924 5.02312 1.09005 4.9346 1.31308L0.579314 12.679L0.534448 12.792C-0.0907536 14.429 -0.167604 16.2247 0.315452 17.9091C0.798508 19.5935 1.81536 21.0756 3.21309 22.1324L3.22971 22.144L3.26793 22.1739L9.90306 27.1407L13.1832 29.625L15.1773 31.1354C15.4115 31.3124 15.6971 31.4082 15.9907 31.4082C16.2842 31.4082 16.5698 31.3124 16.8041 31.1354L18.7981 29.625L22.0799 27.1407L28.7533 22.144L28.7715 22.1307C30.174 21.0749 31.1949 19.5916 31.6802 17.9045C32.1656 16.2175 32.0889 14.4184 31.4618 12.7787Z" fill="#E24329"></path><path d="M31.462 12.7787L31.4172 12.6641C29.2955 13.1013 27.2962 14.0005 25.5614 15.2978L16.0083 22.5378C19.2652 25.0005 22.1001 27.1407 22.1001 27.1407L28.7734 22.144L28.7917 22.1307C30.1907 21.0723 31.2076 19.5877 31.6893 17.9009C32.171 16.214 32.0912 14.4163 31.462 12.7787Z" fill="#FC6D26"></path><path d="M9.9082 27.1407L13.1834 29.625L15.1774 31.1354C15.4117 31.3124 15.6972 31.4082 15.9908 31.4082C16.2844 31.4082 16.57 31.3124 16.8042 31.1354L18.7982 29.625L22.0801 27.1407C22.0801 27.1407 19.2452 25.0005 15.9883 22.5378L9.9082 27.1407Z" fill="#FCA326"></path><path d="M6.43513 15.3045C4.70076 14.0067 2.70123 13.108 0.579333 12.6724L0.534467 12.7854C-0.0923403 14.4232 -0.170036 16.2203 0.313079 17.9061C0.796194 19.5919 1.81396 21.0751 3.21311 22.1324L3.22973 22.144L3.26795 22.1739L9.90307 27.1407L16.0081 22.5378L6.43513 15.3045Z" fill="#FC6D26"></path></svg>',
      //   },
      //   link: 'http://192.168.88.79:8081/ZHAOCHENMIN/icmes-web-new',
      // },
    ],
    editLink: {
      pattern: 'https://github.com/lost-dream/icmes-web/edit/main/docs/src/:path', // github
      // pattern: 'http://192.168.88.79:8081/ZHAOCHENMIN/icmes-web-new/edit/main/docs/src/:path', // gitlab
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
