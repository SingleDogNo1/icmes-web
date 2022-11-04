import { BackModeRouteRecordRaw } from '/@/router/types';

const systemManagement: BackModeRouteRecordRaw = {
  path: '/system',
  name: 'systemManagementLayout',
  component: 'LAYOUT',
  redirect: '/system/log',
  meta: {
    code: 14000,
    icon: 'uil:setting',
  },
  children: [
    {
      path: 'log',
      name: 'systemManagementLog',
      component: '/systemManagement/log/index',
      meta: {
        code: 24000,
      },
    },
    {
      path: 'dictionary',
      name: 'systemManagementDictionary',
      component: '/systemManagement/dictionary/index',
      meta: {
        code: 24100,
      },
    },
    {
      path: 'role',
      name: 'systemManagementRole',
      component: '/systemManagement/role/index',
      meta: {
        code: 24200,
      },
    },
    {
      path: 'user',
      name: 'systemManagementUser',
      component: '/systemManagement/user/index',
      meta: {
        code: 24300,
      },
    },
    {
      path: 'notificationWay',
      name: 'systemManagementNotificationWay',
      component: '/systemManagement/notificationWay/index',
      meta: {
        code: 24600,
      },
    },
    {
      path: 'workflow',
      name: 'systemManagementWorkflow',
      component: '/systemManagement/workflow/index',
      meta: {
        code: 24500,
      },
    },
    {
      path: 'strategy-engine',
      name: 'systemManagementStrategyEngine',
      component: '/systemManagement/strategyEngine/index',
      meta: {
        code: 24900,
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
      },
      children: [
        {
          path: 'index',
          name: 'systemManagementConfigurableObjects',
          component: '/systemManagement/configurableObjects/index',
          meta: {
            code: 24700,
          },
        },
        {
          path: 'detail',
          name: 'systemManagementConfigurableObjectsDetail',
          component: '/systemManagement/configurableObjects/detail',
          meta: {
            code: 24700,
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/system/configurable-objects/index',
          },
        },
      ],
    },
    {
      path: 'plc',
      name: 'PLCLayout',
      component: 'LAYOUT',
      redirect: '/system/plc/collocation',
      meta: {
        code: 24800,
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'collocation',
          name: 'PLCCollocation',
          component: '/systemManagement/PLCCollocation/index',
          meta: {
            code: 24800,
          },
        },
        {
          path: 'signalConfig',
          name: 'PLCSignalConfig',
          component: '/systemManagement/PLCCollocation/signalConfig',
          meta: {
            code: 24800,
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/system/plc/collocation',
          },
        },
      ],
    },
  ],
};

export default systemManagement;
