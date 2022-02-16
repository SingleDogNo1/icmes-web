import { BackModeRouteRecordRaw } from '/@/router/types';

const archives: BackModeRouteRecordRaw = {
  path: '/archives',
  name: 'ArchivesLayout',
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
      name: 'ArchivesOrganization',
      component: '/archives/organization/index',
      meta: {
        code: 21000,
        title: 'routes.archives.organization',
      },
    },
    {
      path: 'location',
      name: 'ArchivesLocation',
      component: '/archives/locations/index',
      meta: {
        code: 21100,
        title: 'routes.archives.location',
      },
    },
    {
      path: 'vendor',
      name: 'ArchivesVendor',
      component: '/archives/vendor/index',
      meta: {
        code: 21300,
        title: 'routes.archives.vendor',
      },
    },
    {
      path: 'calendar',
      name: 'ArchivesCalendar',
      component: '/archives/calendar/index',
      meta: {
        code: 25300,
        title: 'routes.archives.calendar',
      },
    },
    {
      path: 'power-cut-config',
      redirect: '/archives/power-cut-config/index',
      component: 'LAYOUT',
      meta: {
        code: 21600,
        hideChildrenInMenu: true,
        title: 'routes.archives.powerCutConfig.title',
      },
      children: [
        {
          path: 'index',
          name: 'ArchivesPowerCutConfig',
          component: '/archives/powerCutConfig/index',
          meta: {
            code: 21600,
            title: 'routes.archives.powerCutConfig.title',
          },
        },
        {
          path: 'edit',
          name: 'ArchivesEditPowerCutConfig',
          component: '/archives/powerCutConfig/edit',
          meta: {
            code: 21600,
            hideTab: true,
            hideMenu: true,
            title: 'routes.archives.powerCutConfig.title',
          },
        },
      ],
    },
  ],
};

export default archives;
