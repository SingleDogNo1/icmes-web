import { BackModeRouteRecordRaw } from '/@/router/types';

// 生产管理
const productionManagement: BackModeRouteRecordRaw = {
  path: '/prod-manage',
  name: 'ProdManageLayout',
  component: 'LAYOUT',
  redirect: '/prod-manage/dispatch',
  meta: {
    code: 15000,
    icon: 'clarity:calendar-outline-badged',
    title: 'routes.productionManagement.title',
  },
  children: [
    // 调度日志(系统运转日志)
    {
      path: 'dispatch',
      name: 'ProdManageDispatchLayout',
      component: 'LAYOUT',
      redirect: '/prod-manage/dispatch/index',
      meta: {
        code: 25010,
        hideChildrenInMenu: true,
        hideBreadcrumb: true,
        title: 'routes.productionManagement.dispatch',
      },
      children: [
        {
          path: 'index',
          name: 'ProdManageDispatch',
          component: '/productionManagement/dispatch/index',
          meta: {
            code: 25010,
            currentActiveMenu: '/prod-manage/dispatch',
            hideBreadcrumb: true,
            hideTab: true,
            title: 'routes.productionManagement.dispatch',
          },
        },
        {
          path: 'log/:id',
          name: 'ProdManageDispatchDetail',
          component: '/productionManagement/dispatch/detail',
          meta: {
            code: 25010,
            currentActiveMenu: '/prod-manage/dispatch',
            hideTab: true,
            hideBreadcrumb: true,
            title: 'routes.productionManagement.dispatch',
          },
        },
      ],
    },
  ],
};

export default productionManagement;
