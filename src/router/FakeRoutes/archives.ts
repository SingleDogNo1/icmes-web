import { BackModeRouteRecordRaw } from '/@/router/types';

const archives: BackModeRouteRecordRaw = {
  path: '/archives',
  name: 'BoardLayout',
  component: 'LAYOUT',
  redirect: '/archives/organization',
  meta: {
    code: 11000,
    icon: 'cil:folder-open',
    title: 'routes.archives.title',
  },
  children: [
    {
      path: 'organization',
      name: 'Organization',
      component: '/record/organization/index',
      meta: {
        code: 21000,
        title: 'routes.archives.organization',
      },
    },
    {
      path: 'location',
      name: 'Location',
      component: '/record/locations/index',
      meta: {
        code: 21100,
        title: 'routes.archives.location',
      },
    },
  ],
};

export default archives;
