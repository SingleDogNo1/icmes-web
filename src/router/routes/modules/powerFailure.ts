import { BackModeRouteRecordRaw } from '/@/router/types';

const powerFailure: BackModeRouteRecordRaw = {
  path: '/powerFailure',
  name: 'PowerFailureLayout',
  component: 'LAYOUT',
  redirect: '/powerFailure/index',
  meta: {
    code: 10100,
    icon: 'powerFailure|svg',
  },
  children: [
    {
      path: 'index',
      name: 'PowerFailure',
      component: '/powerFailure/index',
      meta: {
        code: 25800,
      },
    },
    {
      path: 'form',
      name: 'editPowerFailureForm',
      component: '/powerFailure/editPowerCutList',
      meta: {
        code: 25800,
        hideMenu: true,
        hideTab: true,
        currentActiveMenu: '/powerFailure/index',
      },
    },
  ],
};

export default powerFailure;
