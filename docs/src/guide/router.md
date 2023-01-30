# 路由

项目路由配置存放于 `src/router/routes` 下面。 `src/router/routes/modules`用于存放路由模块，在该目录下的文件会自动注册。

## 配置

### 模块说明

::: warning 注意事项

- 整个项目所有路由 `name` 不能重复
- 所有的多级路由最终都会转成二级路由，所以不能内嵌子路由
- 除了 layout 对应的 path 前面需要加 `/`，其余子路由都不要以`/`开头
- 必须定义`meta.code`，表示后端对该目录设置的权限

:::

在 `src/router/routes/modules`内的 `.ts` 文件会被视为一个路由模块，本项目由后端鉴权，路由格式参照如下

```ts
import { BackModeRouteRecordRaw } from '/@/router/types';

const powerFailure: BackModeRouteRecordRaw = {
  path: '/powerFailure',
  name: 'PowerFailureLayout',
  component: 'LAYOUT', // 布局组件，'LAYOUT' | 'IFRAME'
  redirect: '/powerFailure/index',
  meta: {
    code: 10100,
    icon: 'ion:grid-outline',
    title: 'routes.powerFailure.title',
  },
  children: [
    {
      path: 'index',
      name: 'PowerFailure',
      // 表示 src/views/powerFailure/index.vue, 省略 src/views 和 .vue 结尾
      component: '/powerFailure/index',
      meta: {
        code: 25800,
        title: 'routes.powerFailure.powerFailure',
      },
    },
  ],
};

export default powerFailure;
```

登录成功后，`/src/store/modules/permission.ts`中`buildRoutesAction`方法会生成可用的路由列表

### Meta 配置说明

```ts
export interface RouteMeta {
  // 必填，路由权限
  code: string | number;
  // 是否忽略KeepAlive缓存
  ignoreKeepAlive?: boolean;
  // 是否固定标签
  affix?: boolean;
  // 图标，也是菜单图标
  icon?: string;
  // 内嵌iframe的地址
  frameSrc?: string;
  // 指定该路由切换的动画名
  transitionName?: string;
  // 隐藏该路由在面包屑上面的显示
  hideBreadcrumb?: boolean;
  // 如果该路由会携带参数，且需要在tab页上面显示。则需要设置为true
  carryParam?: boolean;
  // 隐藏所有子菜单
  hideChildrenInMenu?: boolean;
  // 当前激活的菜单。用于配置详情页时左侧激活的菜单路径
  currentActiveMenu?: string;
  // 当前路由不再标签页显示
  hideTab?: boolean;
  // 当前路由不再菜单显示
  hideMenu?: boolean;
  // 忽略路由。用于在ROUTE_MAPPING以及BACK权限模式下，生成对应的菜单而忽略路由。2.5.3以上版本有效
  ignoreRoute?: boolean;
  // 是否在子级菜单的完整path中忽略本级path。2.5.3以上版本有效
  hidePathForChildren?: boolean;
}
```

### 外部页面嵌套

只需要将 `frameSrc` 设置为需要跳转的地址即可

```ts
const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');
{
  path: 'doc',
  name: 'Doc',
  component: `IFrame`,
  meta: {
    frameSrc: 'https://www.baidu.com/',
    title: t('routes.demo.iframe.doc'),
  },
},
```

### 外链

只需要将 `path` 设置为需要跳转的**HTTP 地址**即可

```ts
{
  path: 'https://www.baidu.com/',
  name: 'BaiDuExternal',
  component: 'IFrame',
  meta: {
    title: '百度',
  },
}
```

## 图标

这里的 `icon` 配置，会同步到 **菜单**（icon 的值可以查看[此处](../components/icon.md)）。

## 新增路由

### 如何新增一个路由模块

1. 在 `src/router/routes/modules` 内新增一个模块文件。

示例，新增 test.ts 文件

```ts
import { BackModeRouteRecordRaw } from '/@/router/types';

const test: BackModeRouteRecordRaw = {
  path: '/test',
  name: 'TEST',
  component: 'LAYOUT',
  redirect: '/test/index',
  meta: {
    code: 'TEST_ROUTE_CODE',
    icon: 'ion:grid-outline',
    title: 'routes.test.title',
  },
  children: [
    {
      path: 'index',
      name: 'TEST_INDEX',
      component: '/test/index',
      meta: {
        code: 'TEST_CHILD_ROUTE_CODE',
        title: 'routes.test.title',
      },
    },
  ],
};

export default test;
```

此时路由已添加完成，不需要手动引入便会自动被加载。

### 验证

访问 **ip:端口/test/index** 出现对应组件内容即代表成功

## 路由刷新

项目中采用的是**重定向**方式

### 实现

```ts
import { useRedo } from '/@/hooks/web/usePage';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const redo = useRedo();
    // 执行刷新
    redo();
    return {};
  },
});
```

### Redirect

`src/views/sys/redirect/index.vue`

```ts
import { defineComponent, unref } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'Redirect',
  setup() {
    const { currentRoute, replace } = useRouter();
    const { params, query } = unref(currentRoute);
    const { path } = params;
    const _path = Array.isArray(path) ? path.join('/') : path;
    replace({
      path: '/' + _path,
      query,
    });
    return {};
  },
});
```

## 页面跳转

页面跳转建议采用项目提供的 `useGo`

### 方式

```ts
import { useGo } from '/@/hooks/web/usePage';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const go = useGo();

    // 执行刷新
    go();
    go(PageEnum.Home);
    return {};
  },
});
```

## 多标签页

标签页使用的是 `keep-alive` 和 `router-view` 实现，实现切换 tab 后还能保存切换之前的状态。

### 如何开启页面缓存

开启缓存有 3 个条件

1. 在 `src/settings/projectSetting.ts`内将`openKeepAlive` 设置为 `true`
2. 路由设置 `name`，且**不能重复**
3. 路由对应的组件加上 `name`，与路由设置的 `name` 保持一致

```ts
 {
   ...,
    // name
    name: 'Login',
    // 对应组件组件的name
    component: () => import('/@/views/sys/login/index.vue'),
    ...
  },

  // /@/views/sys/login/index.vue
  export default defineComponent({
    // 需要和路由的name一致
    name:"Login"
  });
```

:::warning 注意

keep-alive 生效的前提是：需要将路由的 `name` 属性及对应的页面的 `name` 设置成一样。因为：

**include - 字符串或正则表达式，只有名称匹配的组件会被缓存** :::

### 如何让某个页面不缓存

**可在 router.meta 下配置**

可以将 `ignoreKeepAlive` 配置成 `true` 即可关闭缓存。

```ts
export interface RouteMeta {
  // 是否忽略KeepAlive缓存
  ignoreKeepAlive?: boolean;
}
```
