import type { AppRouteModule, AppRouteRecordRaw, BackModeRouteRecordRaw } from '/@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';

import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '/@/utils/log';
import { createRouter, createWebHashHistory } from 'vue-router';
import { usePermissionStore } from '/@/store/modules/permission';
import { useUserStore } from '/@/store/modules/user';

export type LayoutMapKey = 'LAYOUT';
const IFRAME = () => import('/@/views/sys/iframe/FrameBlank.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// Dynamic introduction
function asyncImportRoute(routes: BackModeRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { component, name /* meta */ } = item;
    // const hasPermission = permCodes.includes(meta.code?.toString() as never);
    // meta.hideMenu = !hasPermission;
    // meta.hideBreadcrumb = !hasPermission;
    // meta.hideTab = !hasPermission;

    const { children } = item;

    /*
     * // TODO
     * 在登录 => 退出 => 再次登录时，读取到的 component 不是一个字符串而是一个解析完成的 import 函数
     * 是我写的有问题还是 Vite 本身存在 bug？如何处理？
     * 暂定以下解决方案，待修复：如果判断到 component 类型为函数，直接使用
     */
    if (component) {
      let layoutFound;
      if (typeof component === 'function') {
        layoutFound = component;
      } else if (typeof component === 'string') {
        layoutFound = LayoutMap.get(component.toUpperCase());
      }
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(dynamicViewsModules, component as string)!;
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../views', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    warn('请不要在 views 文件夹下同一层级同时创建`.vue`和`.tsx`文件，这会导致动态引入失败');
    return;
  } else {
    warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}

// Turn background objects into routing objects
export function transformObjToRoute<T = BackModeRouteRecordRaw>(
  routeList: BackModeRouteRecordRaw[],
): T[] {
  routeList.forEach((route) => {
    const component = route.component as string;
    if (component) {
      // 查询对应的路由权限码，如果当前主菜单权限下没有任何子菜单，隐藏该主菜单
      route.meta.hideMenu = false;
      const userStore = useUserStore();
      const menus = userStore.getMenu;
      const permissionStore = usePermissionStore();
      const permCodes = permissionStore.getPermCodeList;
      const menuItem = menus[route.meta.code];
      let subMenuNumber = 0;
      for (const key in menuItem.childs) {
        if (permCodes.includes(key as never)) {
          subMenuNumber++;
        }
      }
      if (subMenuNumber === 0) {
        route.meta.hideMenu = true;
      }

      /*
       * FIXME 在登录 => 退出 => 再次登录时，读取到的 component 不是一个字符串而是一个解析完成的 import 函数
       * 是我写的有问题还是 Vite 本身存在 bug？如何处理？
       * 暂定以下解决方案，待修复：如果判断到 component 类型为函数，直接使用 LAYOUT 组件
       */
      if (
        typeof route.component === 'function' ||
        (typeof route.component === 'string' && component.toUpperCase() === 'LAYOUT')
      ) {
        route.component = LayoutMap.get('LAYOUT')!;
      } else {
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    } else {
      warn('请正确配置路由:' + route?.name + '的component属性');
    }
    route.children && asyncImportRoute(route.children);
  });
  return routeList as unknown as T[];
}

/**
 * Convert multi-level routing to level 2 routing
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// Add all sub-routes to the secondary route
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule,
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
function isMultipleRoute(routeModule: AppRouteModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}
