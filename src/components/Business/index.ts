import { withInstall } from '/@/utils';
import roleTree from './src/RoleTree.vue';
import calendar from './src/calendar/index.vue';

export const RoleTree = withInstall(roleTree);
export const Calendar = withInstall(calendar);
