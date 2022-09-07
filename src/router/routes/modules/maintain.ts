import { BackModeRouteRecordRaw } from '/@/router/types';

const maintain: BackModeRouteRecordRaw = {
  path: '/maintain',
  name: 'maintainLayout',
  component: 'LAYOUT',
  redirect: '/maintain/order',
  meta: {
    code: 16000,
    icon: 'equipmentMaintenance|svg',
    title: 'routes.maintain.title',
  },
  children: [
    {
      path: 'order',
      name: 'maintenanceOrders',
      component: '/maintenance/maintenanceOrder/index',
      meta: {
        code: 26500,
        title: 'routes.maintain.maintenanceOrder',
      },
    },
  ],
};

export default maintain;
