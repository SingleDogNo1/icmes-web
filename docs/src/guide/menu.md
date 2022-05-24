# 菜单

项目菜单配置存放于 `/src/router/menus` 下面

::: tip 提示

菜单必须和路由匹配才能显示

:::

## 菜单项类型

```ts
export interface Menu {
  //  菜单名
  name: string;
  // 菜单图标,如果没有，则会尝试使用route.meta.icon
  icon?: string;
  // 菜单路径
  path: string;
  // 是否禁用
  disabled?: boolean;
  // 子菜单
  children?: Menu[];
  // 菜单标签设置
  tag: {
    // 为true则显示小圆点
    dot: boolean;
    // 内容
    content: string';
    // 类型
    type: 'error' | 'primary' | 'warn' | 'success';
  };
  // 是否隐藏菜单
  hideMenu?: boolean;
}
```

## 菜单模块

一个菜单文件会被当作一个模块

::: tip 提示

children 的 path 字段不需要以`/`开头

:::

```ts
import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const menu: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.dashboard.dashboard'),
    path: '/dashboard',

    children: [
      {
        path: 'analysis',
        name: t('routes.dashboard.analysis'),
      },
      {
        path: 'workbench',
        name: t('routes.dashboard.workbench'),
      },
    ],
  },
};
export default menu;
```

以上模块会转化成以下结构

```ts
[
  path: '/dashboard',
  name: t('routes.dashboard.dashboard'),
  children: [
    {
      path: 'dashboard/analysis',
      name: t('routes.dashboard.analysis'),
    },
    {
      path: 'dashboard/workbench',
      name: t('routes.dashboard.workbench'),
    },
  ],
]
```

## 新增菜单

直接在 `/@/router/menus/modules` 内新增一个模块文件即可。

不需要手动引入，放在`/@/router/routes/menus/modules` 内的文件会自动被加载。

### 菜单项的图标

老项目的目录图标使用的是 jpg|png 格式图标, 本项目统一采用 `svg / iconify` 作为图标管理, 方法就是将旧项目图标替换为 `svg` 图标. 最好的办法是找设计组重新要一份正式的 `svg` 文件,放在`src/assets/icons`文件夹下即可. 如果欣姐很忙, 可以尝试将 `png` 转成 `svg` 格式临时使用. 方法如下:

- 控制台查看老项目目录图标,将 `base64 格式代码`拷贝
- 在 `src/assets/icons` 新建对应的图标文件,结尾为 `.svg`
- 粘贴 `src/assets/icons/powerFailure.svg` 内容,将 `image > href`中代码替换为拷贝的代码即可
- 在路由文件中`meta.icon`指定为修改的图标名字, **切记后缀为 `图标名|svg`**,参考[Svg Sprite 图标规范](/dep/icon.html#svg-sprite-图标)

::: warning 警告

最终一定要替换成正式的 svg 文件, 因为临时生成的文件本质上不符合 svg 语法规范

:::

## 菜单排序

在菜单模块内，设置 `orderNo` 变量，数值越大，排序越靠后
