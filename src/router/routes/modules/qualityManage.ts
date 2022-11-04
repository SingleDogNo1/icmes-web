import { BackModeRouteRecordRaw } from '/@/router/types';

const qualityManage: BackModeRouteRecordRaw = {
  path: '/quality',
  name: 'qualityLayout',
  component: 'LAYOUT',
  redirect: '/quality/index',
  meta: {
    code: 19000,
    icon: 'fa:diamond',
  },
  children: [
    {
      path: 'commodity-coal-detection',
      name: 'commodityCoalDetection',
      component: '/qualityManage/commodityCoalDetection/index',
      meta: {
        code: 29200,
      },
    },
  ],
};

export default qualityManage;
