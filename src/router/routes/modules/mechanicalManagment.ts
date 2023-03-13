import { BackModeRouteRecordRaw } from '/@/router/types';

// 生产管理
const productionManagement: BackModeRouteRecordRaw = {
  path: '/mechanical',
  name: 'MechanicalManageLayout',
  component: 'LAYOUT',
  redirect: '/prod-manage/dispatch',
  meta: {
    code: 10300,
    icon: 'academicons:open-materials-square',
  },
  children: [
    {
      path: 'warehouse',
      name: 'MechanicalManageWarehouseManageLayout',
      component: '/mechanicalManagement/warehouse/index',
      meta: {
        code: 23700,
      },
    },
  ],
};

export default productionManagement;
