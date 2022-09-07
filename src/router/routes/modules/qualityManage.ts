import { BackModeRouteRecordRaw } from '/@/router/types';

const qualityManage: BackModeRouteRecordRaw = {
  path: '/quality',
  name: 'qualityLayout',
  component: 'LAYOUT',
  redirect: '/quality/index',
  meta: {
    code: 19000,
    icon: 'fa:diamond',
    title: 'routes.qualityManage.title',
  },
  children: [
    {
      path: 'commodity-coal-detection',
      name: 'commodityCoalDetection',
      component: '/qualityManage/commodityCoalDetection/index',
      meta: {
        code: 29200,
        title: 'routes.qualityManage.commodityCoalDetection',
      },
    },
  ],
};

export default qualityManage;
