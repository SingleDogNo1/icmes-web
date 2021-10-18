# 权限

## 后台动态获取

**实现原理:** 是通过接口动态生成路由表，且遵循一定的数据结构返回。前端根据需要处理该数据为可识别的结构，再通过 `router.addRoutes` 添加到路由实例，实现权限的动态生成。

### 实现

- 在[项目配置](./settings.md#项目配置)将系统内权限模式改为 `BACK` 模式

```ts
// ! 改动后需要清空浏览器缓存
const setting: ProjectConfig = {
  // 权限模式
  permissionMode: PermissionModeEnum.BACK,
};
```

1. 路由拦截，与角色权限模式一致

**permissionStore.buildRoutesAction** 用于**过滤动态路由**，详细代码见 [/@/store/modules/permission.ts](https://github.com/anncwb/vue-vben-admin/tree/main/src/store/modules/permission.ts)

```ts
// 主要代码
if (permissionMode === PermissionModeEnum.BACK) {
  const { createMessage } = useMessage();

  createMessage.loading({
    content: t('sys.app.menuLoading'),
    duration: 1,
  });

  // !Simulate to obtain permission codes from the background,
  // this function may only need to be executed once, and the actual project can be put at the right time by itself
  let routeList: AppRouteRecordRaw[] = [];
  try {
    this.changePermissionCode();
    routeList = (await getMenuList()) as AppRouteRecordRaw[];
  } catch (error) {
    console.error(error);
  }

  // Dynamically introduce components
  routeList = transformObjToRoute(routeList);

  //  Background routing to menu structure
  const backMenuList = transformRouteToMenu(routeList);
  this.setBackMenuList(backMenuList);

  routeList = flatMultiLevelRoutes(routeList);
  routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
}
```

**getMenuList 返回值格式**

返回值由多个路由模块组成

::: warning 注意

后端接口返回的数据中必须包含`PageEnum.BASE_HOME`指定的路由（path 定义于`src/enums/pageEnum.ts`）

:::

```ts
[
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: '/dashboard/welcome/index',
    meta: {
      title: 'routes.dashboard.welcome',
      affix: true,
      icon: 'ant-design:home-outlined',
    },
  },
  {
    path: '/permission',
    name: 'Permission',
    component: 'LAYOUT',
    redirect: '/permission/front/page',
    meta: {
      icon: 'carbon:user-role',
      title: 'routes.demo.permission.permission',
    },
    children: [
      {
        path: 'back',
        name: 'PermissionBackDemo',
        meta: {
          title: 'routes.demo.permission.back',
        },

        children: [
          {
            path: 'page',
            name: 'BackAuthPage',
            component: '/demo/permission/back/index',
            meta: {
              title: 'routes.demo.permission.backPage',
            },
          },
          {
            path: 'btn',
            name: 'BackAuthBtn',
            component: '/demo/permission/back/Btn',
            meta: {
              title: 'routes.demo.permission.backBtn',
            },
          },
        ],
      },
    ],
  },
];
```

### 动态更换菜单

系统提供 [usePermission](https://github.com/anncwb/vue-vben-admin/tree/main/src/hooks/web/usePermission.ts) 方便角色相关操作

```ts
import { usePermission } from '/@/hooks/web/usePermission';
import { RoleEnum } from '/@/enums/roleEnum';

export default defineComponent({
  setup() {
    const { changeMenu } = usePermission();

    // 更改菜单的实现需要自行去修改
    changeMenu();
    return {};
  },
});
```

### 细粒度权限

**函数方式**

[usePermission](https://github.com/anncwb/vue-vben-admin/tree/main/src/hooks/web/usePermission.ts) 还提供了按钮级别的权限控制。

```vue
<template>
  <a-button v-if="hasPermission(['20000', '2000010'])" color="error" class="mx-4">
    拥有[20000,2000010]code可见
  </a-button>
</template>
<script lang="ts">
  import { usePermission } from '/@/hooks/web/usePermission';
  import { RoleEnum } from '/@/enums/roleEnum';

  export default defineComponent({
    setup() {
      const { hasPermission } = usePermission();
      return { hasPermission };
    },
  });
</script>
```

**组件方式**

具体查看[权限组件使用](../components/auth.md)

**指令方式**

::: tip

指令方式不能动态更改权限

:::

```html
<a-button v-auth="'1000'" type="primary" class="mx-4"> 拥有code ['1000']权限可见 </a-button>
```

### 如何初始化 code

通常，如需做按钮级别权限，后台会提供相应的 code，或者类型的判断标识。这些编码只需要在登录后获取一次即可。

```ts
import { getPermCodeByUserId } from '/@/api/sys/user';
import { permissionStore } from '/@/store/modules/permission';
async function changePermissionCode(userId: string) {
  // 从后台获取当前用户拥有的编码
  const codeList = await getPermCodeByUserId({ userId });
  permissionStore.commitPermCodeListState(codeList);
}
```
