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
    {
      path: 'advance-search',
      name: 'devicesManagementAdvanceList',
      component: '/devicesManagement/devicesList/advanceSearch',
      meta: {
        code: 23000,
        hideMenu: true,
        hideTab: true,
        currentActiveMenu: '/device/list',
      },
    },
    {
      path: 'type',
      name: 'devicesManagementType',
      component: '/devicesManagement/devicesType/index',
      meta: {
        code: 23100,
      },
    },
  ],
};

export default devicesManagement;
