import { BackModeRouteRecordRaw } from '/@/router/types';

const systemManagement: BackModeRouteRecordRaw = {
  path: '/system',
  name: 'systemManagementLayout',
  component: 'LAYOUT',
  redirect: '/system/log',
  meta: {
    code: 10100,
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
  ],
};

export default systemManagement;
