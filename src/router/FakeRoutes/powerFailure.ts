const powerFailure = {
  path: '/powerFailure',
  name: 'PowerFailureLayout',
  component: 'LAYOUT',
  redirect: '/powerFailure/productionBoard',
  meta: {
    code: 17000,
    icon: 'ion:grid-outline',
    title: 'routes.board.board',
  },
  children: [
    {
      path: 'productionBoard',
      name: 'ProductionBoard',
      component: () => '/board/production/index.vue',
      meta: {
        code: 27500,
        title: 'routes.board.productionBoard',
      },
    },
    {
      path: 'alarmBoard',
      name: 'AlarmBoard',
      component: () => '/board/alarm/index.vue',
      meta: {
        code: 27100,
        title: 'routes.board.alarmBoard',
      },
    },
    {
      path: 'taskBoard',
      name: 'TaskBoard',
      component: () => '/board/task/index.vue',
      meta: {
        code: 27600,
        title: 'routes.board.taskBoard',
      },
    },
  ],
};

export default powerFailure;
