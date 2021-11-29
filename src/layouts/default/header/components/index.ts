import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import FullScreen from './FullScreen.vue';

export const LayoutBreadcrumb = createAsyncComponent(() => import('./Breadcrumb.vue'));
export const ErrorAction = createAsyncComponent(() => import('./ErrorAction.vue'));
export const Notify = createAsyncComponent(() => import('./notify/index.vue'));
export const Audit = createAsyncComponent(() => import('./audit.vue'));
export const Task = createAsyncComponent(() => import('./task.vue'));
export const UserDropDown = createAsyncComponent(() => import('./user-dropdown/index.vue'), {
  loading: true,
});

export { FullScreen };
