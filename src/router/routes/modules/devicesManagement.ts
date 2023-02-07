import { BackModeRouteRecordRaw } from '/@/router/types';

const devicesManagement: BackModeRouteRecordRaw = {
  path: '/device',
  name: 'devicesManagementLayout',
  component: 'LAYOUT',
  redirect: '/device/list',
  meta: {
    code: 13000,
    icon: 'heroicons:computer-desktop',
  },
  children: [
    {
      path: 'list',
      name: 'devicesManagementList',
      component: '/devicesManagement/devicesList/index',
      meta: {
        code: 23000,
      },
    },
  ],
};

export default devicesManagement;
