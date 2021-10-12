import { BackModeRouteRecordRaw } from '/@/router/types';

const board: BackModeRouteRecordRaw = {
  path: '/board',
  name: 'BoardLayout',
  component: 'LAYOUT',
  redirect: '/board/productionBoard',
  meta: {
    code: 17000,
    icon: 'ion:grid-outline',
    title: 'routes.board.title',
  },
  children: [
    {
      path: 'productionBoard',
      name: 'ProductionBoard',
      component: '/board/production/index',
      meta: {
        code: 27500,
        title: 'routes.board.productionBoard',
      },
    },
    {
      path: 'productionBoard/create',
      name: 'CreateProductionBoard',
      component: '/board/production/create',
      meta: {
        code: 275000,
        title: 'routes.board.productionBoard',
      },
    },
    {
      path: 'alarmBoard',
      name: 'AlarmBoard',
      component: '/board/alarm/index',
      meta: {
        code: 27100,
        title: 'routes.board.alarmBoard',
      },
    },
    {
      path: 'taskBoard',
      name: 'TaskBoard',
      component: '/board/task/index',
      meta: {
        code: 27600,
        title: 'routes.board.taskBoard',
      },
    },
  ],
};

export default board;
