import type { AppRouteRecordRaw, Menu, BackModeRouteRecordRaw } from '/@/router/types';
import type { Menu as ConfigMenu } from '/@/api/info/model/configModel';
import { defineStore } from 'pinia';
import { remove, orderBy } from 'lodash-es';
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
import { error } from '/@/utils/log';

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
      const { getFeature } = useUserStore();
      const feature = toRaw(getFeature) || [];
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
                error('end');
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
        const ori_routes = import.meta.glob('../../router/routes/modules/**/*.ts', { eager: true });
        const routes: any[] = [];

        const { getMenu: menu } = useUserStore();

        // 获取后台返回目录权限
        function traversalObject<T>(obj) {
          const arr: T[] = [];
          function fun(obj) {
            if (!obj) return;
            Object.keys(obj).forEach((K) => {
              fun(obj[K].childs);
              const z = { ...{ code: Number(K) }, ...obj[K] };
              delete z.childs;
              arr.push(z);
            });
          }
          fun(obj);
          return arr;
        }

        const menuList = traversalObject<ConfigMenu & { code: number }>(menu);

        Object.keys(ori_routes).forEach((key) => {
          const mod = (ori_routes[key] as Record<string, any>).default || {};
          const modList = Array.isArray(mod) ? [...mod] : [mod];

          // 获取路由文件，对应后台权限写入 title 和 order
          function genRoute(list) {
            list.forEach((item) => {
              menuList.forEach((item2) => {
                if (item.meta.code === item2.code) {
                  item.meta.title = item.meta.title || item2.name;
                  item.meta.order = item.meta.order || item2.order;

                  if (item.children) {
                    genRoute(item.children);
                  }
                }
              });
            });
          }
          genRoute(modList);

          routes.push(...modList);
        });

        // 生成的菜单中 meta 中没有 order 字段，表示没有出现在后台返回的权限中，过滤
        function filterTree(tree: any[] = [], arr: any[] = []) {
          if (!tree.length) return [];
          for (const item of tree) {
            if (!item.meta.order) continue;
            let node: any = undefined;
            if (Array.isArray(item.children)) {
              node = { ...item, children: [] };
            } else {
              node = { ...item };
            }
            arr.push(node);
            if (item.children && item.children.length) filterTree(item.children, node.children);
          }
          return arr;
        }

        const filter_routes = filterTree(routes);

        if (!import.meta.env.VITE_RUNTIME_ENV && import.meta.env.PROD) {
          // 正式线上环境，删除 demo 路由
          remove(filter_routes, (item) => item.name === 'Demo');
        }

        routeList = orderBy(filter_routes, 'meta.order');
      } catch (err: any) {
        error(err);
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
