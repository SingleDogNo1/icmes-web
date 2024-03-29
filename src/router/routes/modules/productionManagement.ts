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
          },
        },
      ],
    },
    {
      path: 'yearPlan',
      name: 'ProdManageYearPlanLayout',
      component: 'LAYOUT',
      redirect: '/prod-manage/yearPlan/index',
      meta: {
        code: 25030,
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'index',
          name: 'ProdManageYearPlan',
          component: '/productionManagement/yearPlan/index',
          meta: {
            currentActiveMenu: '/prod-manage/yearPlan',
            code: 25030,
            hideChildrenInMenu: true,
          },
        },
      ],
    },
    {
      path: 'monthPlan',
      name: 'ProdManageMonthPlanLayout',
      component: 'LAYOUT',
      redirect: '/prod-manage/monthPlan/index',
      meta: {
        code: 25000,
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'index',
          name: 'ProdManageMonthPlan',
          component: '/productionManagement/monthPlan/index',
          meta: {
            currentActiveMenu: '/prod-manage/monthPlan',
            code: 25000,
            hideChildrenInMenu: true,
          },
        },
      ],
    },
  ],
};

export default productionManagement;
