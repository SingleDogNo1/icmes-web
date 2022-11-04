import { BackModeRouteRecordRaw } from '/@/router/types';

const archives: BackModeRouteRecordRaw = {
  path: '/archives',
  name: 'ArchivesLayout',
  component: 'LAYOUT',
  redirect: '/archives/organization',
  meta: {
    code: 11000,
    icon: 'cil:folder-open',
  },
  children: [
    {
      path: 'organization',
      name: 'ArchivesOrganization',
      component: '/archives/organization/index',
      meta: {
        code: 21000,
      },
    },
    {
      path: 'location',
      name: 'ArchivesLocation',
      component: '/archives/locations/index',
      meta: {
        code: 21100,
      },
    },
    {
      path: 'vendor',
      name: 'ArchivesVendor',
      component: '/archives/vendor/index',
      meta: {
        code: 21300,
      },
    },
    {
      path: 'calendar',
      name: 'ArchivesCalendar',
      component: '/archives/calendar/index',
      meta: {
        code: 25300,
      },
    },
    {
      path: 'switch-room',
      name: 'SwitchRoom',
      component: '/archives/switchRoom/index',
      meta: {
        code: 21400,
      },
    },
    {
      path: 'power-cut-config',
      name: 'ArchivesPowerCutConfig',
      component: '/archives/powerCutConfig/index',
      meta: {
        code: 21600,
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'form',
          name: 'ArchivesPowerCutConfigTicketConfig',
          component: '/archives/powerCutConfig/operationTicket/configStep',
          meta: {
            code: 21600,
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/archives/power-cut-config',
          },
        },
      ],
    },
    {
      path: 'staff-info',
      name: 'StaffInfo',
      component: '/archives/staffInfo/index',
      meta: {
        code: 22000,
      },
    },
  ],
};

export default archives;
