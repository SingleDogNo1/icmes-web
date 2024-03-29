import { BackModeRouteRecordRaw } from '/@/router/types';

const board: BackModeRouteRecordRaw = {
  path: '/board',
  name: 'BoardLayout',
  component: 'LAYOUT',
  redirect: '/board/productionBoard',
  meta: {
    code: 17000,
    icon: 'ion:grid-outline',
  },
  children: [
    {
      path: 'https://www.antdv.com/components/overview',
      name: 'ProductionBoard',
      component: 'IFRAME',
      meta: {
        code: 27500,
      },
    },
    {
      path: 'alarmBoard',
      name: 'AlarmBoard',
      component: '/board/alarm/index',
      meta: {
        code: 27100,
      },
    },
    {
      path: 'taskBoard',
      name: 'TaskBoard',
      component: '/board/task/index',
      meta: {
        code: 27600,
      },
    },
  ],
};

export default board;
