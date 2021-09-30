const powerFailure = {
  path: '/powerFailure',
  name: 'PowerFailureLayout',
  component: 'LAYOUT',
  redirect: '/powerFailure/index',
  meta: {
    code: 10100,
    icon: 'ion:grid-outline',
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
  ],
};

export default powerFailure;
