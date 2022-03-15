import { BackModeRouteRecordRaw } from '/@/router/types';

const powerFailure: BackModeRouteRecordRaw = {
  path: '/powerFailure',
  name: 'PowerFailureLayout',
  component: 'LAYOUT',
  redirect: '/powerFailure/index',
  meta: {
    code: 10100,
    icon: 'powerFailure|svg',
    title: 'routes.powerFailure.title',
  },
  children: [
    {
      path: 'index',
      name: 'PowerFailure',
      component: '/powerFailure/index',
      meta: {
        code: 25800,
        title: 'routes.powerFailure.powerFailure',
      },
    },
    {
      path: 'form',
      name: 'editPowerFailureForm',
      component: '/powerFailure/editPowerCutList',
      meta: {
        code: 25800,
        title: 'routes.powerFailure.powerFailure',
        hideMenu: true,
        hideTab: true,
        currentActiveMenu: '/powerFailure/index',
      },
    },
  ],
};

export default powerFailure;
