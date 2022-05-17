import { useRoute } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '/@/store/modules/permission';
import { useUserStore } from '/@/store/modules/user';
import { useTabs } from './useTabs';
import { router, resetRouter } from '/@/router';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';

export function usePermission() {
  const permissionStore = usePermissionStore();
  const { closeAll } = useTabs(router);

  /**
   * Reset and regain authority resource information
   */
  async function resume() {
    const tabStore = useMultipleTabStore();
    tabStore.clearCacheTabs();
    resetRouter();
    const routes = await permissionStore.buildRoutesAction();
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    permissionStore.setLastBuildMenuTime();
    closeAll();
  }

  /**
   *
   * @returns 返回当前页面权限码在数据字典中查找到的键值对
   */
  function getPermissionList() {
    const { getFeature: features } = useUserStore();
    const {
      meta: { code },
    } = useRoute();
    const hasEditPermission = features[code!] as { [index: string]: boolean } | undefined;
    return hasEditPermission;
  }

  /**
   * refresh menu data
   */
  async function refreshMenu() {
    resume();
  }

  return { getPermissionList, refreshMenu };
}
