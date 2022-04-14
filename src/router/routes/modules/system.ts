import { BackModeRouteRecordRaw } from '/@/router/types';

const systemManagement: BackModeRouteRecordRaw = {
  path: '/system',
  name: 'systemManagementLayout',
  component: 'LAYOUT',
  redirect: '/system/log',
  meta: {
    code: 14000,
    icon: 'uil:setting',
    title: 'routes.system.title',
  },
  children: [
    {
      path: 'log',
      name: 'systemManagementLog',
      component: '/systemManagement/log/index',
      meta: {
        code: 24000,
        title: 'routes.system.log',
      },
    },
    {
      path: 'dictionary',
      name: 'systemManagementDictionary',
      component: '/systemManagement/dictionary/index',
      meta: {
        code: 24100,
        title: 'routes.system.dictionary',
      },
    },
    {
      path: 'role',
      name: 'systemManagementRole',
      component: '/systemManagement/role/index',
      meta: {
        code: 24200,
        title: 'routes.system.role',
      },
    },
    {
      path: 'user',
      name: 'systemManagementUser',
      component: '/systemManagement/user/index',
      meta: {
        code: 24300,
        title: 'routes.system.user',
      },
    },
    {
      path: 'notificationWay',
      name: 'systemManagementNotificationWay',
      component: '/systemManagement/notificationWay/index',
      meta: {
        code: 24500,
        title: 'routes.system.notificationWay',
      },
    },
    {
      path: 'workflow',
      name: 'systemManagementWorkflow',
      component: '/systemManagement/workflow/index',
      meta: {
        code: 24500,
        title: 'routes.system.workflow',
      },
    },
    {
      path: 'strategy-engine',
      name: 'systemManagementStrategyEngine',
      component: '/systemManagement/strategyEngine/index',
      meta: {
        code: 24900,
        title: 'routes.system.strategyEngine',
      },
    },
    {
      path: 'configurable-objects',
      name: 'systemManagementConfigurableObjectsLayout',
      component: 'LAYOUT',
      redirect: '/system/configurable-objects/index',
      meta: {
        code: 24700,
        hideChildrenInMenu: true,
        title: 'routes.system.configurableObjects',
      },
      children: [
        {
          path: 'index',
          name: 'systemManagementConfigurableObjects',
          component: '/systemManagement/configurableObjects/index',
          meta: {
            code: 24700,
            title: 'routes.system.configurableObjects',
          },
        },
        {
          path: 'detail',
          name: 'systemManagementConfigurableObjectsDetail',
          component: '/systemManagement/configurableObjects/detail',
          meta: {
            code: 24700,
            title: 'routes.system.configurableObjects',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/system/configurable-objects/index',
          },
        },
      ],
    },
  ],
};

export default systemManagement;
