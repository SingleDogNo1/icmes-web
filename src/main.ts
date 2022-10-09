import 'uno.css';
import '/@/design/index.less';
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';
import { createEnterAnimate } from './design/enterAnimate';

// 打包环境配置了按需导入，但本地开发按需导入反而导致刷新效率降低
// 仅在开发环境下全量引入 antd.css
if (import.meta.env.DEV) {
  import('ant-design-vue/dist/antd.less');
}

async function bootstrap() {
  const app = createApp(App);

  // 创建网页动画用的 css 类名
  createEnterAnimate();

  // 配置 pinia
  setupStore(app);

  // 初始化项目配置
  initAppConfigStore();

  // 注册全局组件
  registerGlobComp(app);

  // 配置国际化
  await setupI18n(app);

  // 初始化路由
  setupRouter(app);

  // 注册路由守卫
  setupRouterGuard(router);

  // 注册全局指令
  setupGlobDirectives(app);

  // 配置全局错误处理
  setupErrorHandle(app);

  app.mount('#app');
}

bootstrap();
