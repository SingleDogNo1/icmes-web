import type { AppRouteRecordRaw, Menu, BackModeRouteRecordRaw } from '/@/router/types';
import { defineStore } from 'pinia';
import { remove } from 'lodash-es';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import {
  ERROR_LOG_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  HOMEPAGE_ROUTE,
  USER_CENTER,
} from '/@/router/routes/basic';
import { ABOUT_PAGE_ROUTE } from '/@/router/routes/basic';
import { filter } from '/@/utils/helper/treeHelper';
import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';

interface PermissionState {
  // Permission code list
  permCodeList: string[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode() {
      const userStore = useUserStore();
      const feature = toRaw(userStore.getFeature) || [];
      const codeList = Object.keys(feature);

      this.setPermCodeList(codeList);
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();

      let routes: AppRouteRecordRaw[] = [];

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = PageEnum.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      const { createMessage } = useMessage();

      createMessage.loading({
        content: t('sys.app.menuLoading'),
        duration: 1,
      });

      let routeList: AppRouteRecordRaw[] | BackModeRouteRecordRaw[] = [];
      try {
        this.changePermissionCode();
        // TODO 在这里调试，完成之后把路由替换到 modules 中
        const ori_routes = import.meta.globEager('../../router/FakeRoutes/**/*.ts');
        const routes: any[] = [];

        const userStore = useUserStore();
        const menu = userStore.getMenu;
        const menuList: any[] = [];
        for (const code in menu) {
          const item = menu[code];
          menuList.push({ ...item, ...{ code: Number(code) } });
        }

        console.log('menuList :>> ', menuList);

        Object.keys(ori_routes).forEach((key) => {
          const mod = ori_routes[key].default || {};
          const modList = Array.isArray(mod) ? [...mod] : [mod];
          console.log('modList :>> ', modList);
          menuList.map((item) => {
            if (item.code === modList[0].meta.code) {
              modList[0].meta.orderNo = item.order;
              console.log('item :>> ', item);
            }
          });
          routes.push(...modList);
        });

        if (!import.meta.env.DEV) {
          remove(routes, (item) => item.name === 'Demo');
        }

        routeList = routes as AppRouteRecordRaw[];

        routeList.sort((a, b) => (a.meta.orderNo || 0) - (b.meta.orderNo || 0));
      } catch (error) {
        throw error;
      }

      // Dynamically introduce components
      routeList = transformObjToRoute(routeList as BackModeRouteRecordRaw[]) as AppRouteRecordRaw[];

      //  Background routing to menu structure
      const backMenuList = transformRouteToMenu(routeList);

      this.setBackMenuList(backMenuList);

      // remove meta.ignoreRoute item
      routeList = filter(routeList, routeRemoveIgnoreFilter);
      routeList = routeList.filter(routeRemoveIgnoreFilter);

      routeList = flatMultiLevelRoutes(routeList);

      routes = [PAGE_NOT_FOUND_ROUTE, HOMEPAGE_ROUTE, ABOUT_PAGE_ROUTE, USER_CENTER, ...routeList];

      // 404路由必须出现在最后，所以最后再 push
      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
