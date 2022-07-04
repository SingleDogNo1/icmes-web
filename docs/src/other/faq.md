# 常见问题

## 关于缓存更新问题

项目配置默认是缓存在 `localStorage` 内，所以版本更新后可能有些配置没改变。

解决方式是每次更新代码的时候修改 `package.json` 内的 `version` 版本号. 因为 localStorage 的 key 是根据版本号来的。所以更新后版本不同前面的配置会失效。重新登录即可

## 关于修改配置文件的问题

当修改 `.env` 等环境文件及 `vite.config.ts` 文件时，vite 会自动重启服务。

自动重启有几率出现问题，请重新运行项目即可解决.

## esbuild 模式下开启 LEGACY 打包失败

如果将 build.minify 设置为 'esbuild'，且不能启用 LEGACY，否则打包将会报错，两者选其一即可打包。

## 添加菜单后没显示

菜单必须和路由匹配才会显示在界面上，所以得确保菜单和对应的路由存在即可显示.

## 安装 imagemin 依赖安装失败

如果使用 yarn 还是不能安装依赖，可以将图片压缩功能移除，移除方法如下：

- 在 `package.json` 内删除 `vite-plugin-imagemin` 这个依赖。这会导致图片没有压缩，但是可以手动到在线网站进行压缩。这里推荐[tinypng](https://tinypng.com/)
- 2. 注释 `vite-plugin-imagemin` 插件引用

```ts
import { configImageminPlugin } from './imagemin';
VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());
```

## 本地运行报错

由于 vite 在本地没有转换代码，且代码中用到了可选链等比较新的语法。所以本地开发需要使用版本较高的浏览器(`Chrome 85+`)进行开发

## tab 页切换后页面空白

这是由于开启了路由切换动画,且对应的页面组件存在多个根节点导致的，在页面最外层添加`<div></div>`即可

::: tip 提示

- 如果想使用多个根标签，可以禁用路由切换动画
- template 下面的根注释节点也算一个节点

:::

## 组件命名问题

目前在 vite+vue3.0.5 版本中，如果组件命名携带关键字，则可能会导致内存溢出。例如 `ImportExcel` excel 导入组件。

## 我的代码本地开发可以，打包就不行了

目前发现这个原因可能有以下，可以从以下原因来排查，如果还有别的可能，可以提交 pr 来告诉我

1. 使用了 ctx 这个变量，ctx 本身未暴露出在实例类型内，尤大也是说了不要用这个属性。这个属性只是用于内部使用。

```ts
import { getCurrentInstance } from 'vue';
getCurrentInstance().ctx.xxxx;
```

## 依赖安装问题

- 如果依赖安装不了或者启动报错可以先尝试 删除 `yarn.lock` 和 `node_modules`，然后重新运行 `yarn install`
- 如果依赖安装不了或者报错，可以尝试切换手机热点来进行依赖安装。
- 如果还是不行，可以自行配置国内镜像安装。
- 也可以在项目根目录创建 `.npmrc` 文件，内容如下

```bash
# .npmrc
registry = https://registry.npm.taobao.org
```

然后重新执行`yarn run reinstall`等待安装完成即可

## 为什么是 day.js

`day.js` 是 [Ant-Design-Vue](https://www.antdv.com/docs/vue/replace-date-cn) 内部自带的。

## 控制台路由警告问题

如果看到控制台有如下警告，且页面**能正常打开** 可以忽略该警告。

后续 `vue-router` 可能会提供配置项来关闭警告

**2.6.1 及以上版本已移除此警告**

```ts
[Vue Router warn]: No match found for location with path "xxxx"
```

## 启动报错

请检查你的 nodejs 版本号是否符合要求

## 页面报错

当页面出现以下报错，是因为 /xxx 对应的路由组件内部出现了错误。

```ts
 Uncaught (in promise) Error: Couldn't resolve component "default" at "/xxx"
```

可以尝试从以下几点排查

- 检查对应组件内部 import 的所有文件是否正确
- 检查引入方式是否错误。

  ```ts
  // 正确的
  import { cloneDeep } from 'lodash-es';

  // 报错
  import _ from 'lodash-es';
  ```

- 检查样式是否使用变量及有没有引入对应的变量文件
- 检查代码明显的语法错误

这样就不会是使用的取值忘记 xxx.value 来进行数据获取

## 接口请求问题

proxy 代理不成功，没有代理到实际地址？

代理只是服务请求代理，这个地址是不会变的。 原理可以简单的理解为，在本地启了一个服务，你先请求了本地的服务，本地的服务转发了你的请求到实际服务器。所以你在浏览器上看到的请求地址还是 `http://localhost:8000/xxx`。以服务端是否收到请求为准。
