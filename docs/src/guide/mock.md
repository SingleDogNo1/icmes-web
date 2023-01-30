# 数据 mock&联调

## 接口请求

接口统一存放于 `src/api/` 下面管理

以通知接口为例:

- 在 **src/api/** 内新建模块文件夹，并创建`model`文件夹用来管理请求接口类型。模块结构参照 [后台接口](http://192.168.88.151:8088/swagger-ui.html?urls.primaryName=ICMES-%E9%80%9A%E7%9F%A5%E5%AD%90%E7%B3%BB%E7%BB%9F#/)定义模块。信息接口的模块为`notice`，因此新建`notice`文件夹，下面新建`noticeModel`文件夹备用。
- 主模块内部拆分子模块，按照后台模块依次划分为`审批通知(approval)`、`抄送通知(carbon)`、`消息通知( message)`等。其中如遇到与主模块相同的子模块，则命名`basic`。因此新建`approval.ts`、`carbon.ts`、`message.ts`、`basic.ts`。`noticeModel`中对应的新建`approvalModel.ts`、`carbonModel.ts`、`messageModel.ts`、`basicModel.ts`用来管理各自的接口类型。
- 接口类型定义参考后台文档。

## axios 配置

**axios** 请求封装存放于`src/utils/http/axios`文件夹内部

除 `index.ts` 文件内容需要根据项目自行修改外，其余文件无需修改

```js

├── Axios.ts // axios实例
├── axiosCancel.ts // axiosCancel实例，取消重复请求
├── axiosTransform.ts // 数据转换类
├── checkStatus.ts // 返回状态值校验
├── index.ts // 接口返回统一处理

```

### index.ts 配置说明

```ts
const axios = new VAxios({
  // 认证方案，例如: Bearer
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
  authenticationScheme: '',
  // 接口超时时间 单位毫秒
  timeout: 10 * 1000,
  // 接口可能会有通用的地址部分，可以统一抽取出来
  prefixUrl: prefix,
  // 类型为 ContentTypeEnum
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  // 数据处理方式，见下方说明
  transform,
  // 配置项，下面的选项都可以在独立的接口请求中覆盖
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformRequestResult: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'message',
    // 接口地址
    apiUrl: globSetting.apiUrl,
    //  get 请求是否加入时间戳
    joinTime: true,
    // 忽略重复请求
    ignoreCancelToken: true,
  },
});
```

**transform 数据处理说明**

类型定义，见 **axiosTransform.ts** 文件

```js
export abstract class AxiosTransform {
  /**
   * @description: 请求之前处理配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 请求成功处理
   */
  transformRequestData?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatch?: (e: Error) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void;
}
```

## Mock 服务

Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发进程所阻塞。

本项目使用 [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) 来进行 mock 数据处理。

### 配置跨域

项目中因为需要同时请求两份数据:

- 真实接口的返回值
- 开发中需要本地 mock 的模拟数据(本地 mock 环境启动在前端项目端口下)

因此，使用了开发环境代理。

```bash
VITE_PROXY = [['/api', 'http://192.168.88.151:8088'], ['/api/mock', 'http://localhost:3100']];

VITE_GLOB_API_URL=/api
```

如此，便可同时请求线上接口和本地模拟接口

::: tip

- .env 文件中的字段如果是字符串，则无需加引号，默认全部为字符串
- VITE_PROXY 不能换行
- **mock 接口建议统一添加 mock 前缀，以方便开发时区分线上和模拟接口**

:::

### 跨域原理解析

在 `vite.config.ts` 配置文件中，提供了 server 的 proxy 功能，用于代理 API 请求。

```ts
server: {
  proxy: {
    "/basic-api":{
      target: 'http://localhost:3000',
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
    }
  },
},
```

### 如何新增 mock 接口

如果你想添加 mock 数据，只要在根目录下找到 mock 文件，添加对应的接口，对其进行拦截和模拟数据。

在 mock 文件夹内新建文件

::: tip

文件新增后会自动更新，不需要手动重启，可以在代码控制台查看日志信息 mock 文件夹内会自动注册，排除以\_开头的文件夹及文件

:::

例:

```ts
import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess } from '../_util';

const demoList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 60; index++) {
    result.push({
      id: `${index}`,
      beginTime: '@datetime',
      endTime: '@datetime',
      address: '@city()',
      name: '@cname()',
      'no|100000-10000000': 100000,
      'status|1': ['正常', '启用', '停用'],
    });
  }
  return result;
})();

export default [
  {
    url: '/api/mock/table/getDemoList',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, demoList);
    },
  },
] as MockMethod[];
```

::: tip

mock 的值可以直接使用 [mockjs](https://github.com/nuysoft/Mock/wiki) 的语法。

:::

### 接口格式

```ts
{
  url: string; // mock 接口地址
  method?: MethodType; // 请求方式
  timeout?: number; // 延时时间
  statusCode: number; // 响应状态码
  response: ((opt: { // 响应结果
      body: any;
      query: any;
  }) => any) | object;
}
```

### 参数获取

**GET 接口：**`({ query }) => { }`

**POST 接口：**`({ body }) => { }`

### 如何去掉 mock

当后台接口已经开发完成，只需要将相应的 mock 函数去掉即可。

以上方接口为例，假如后台接口 login 已经开发完成，则只需要删除/注释掉下方代码即可

```ts
export default [
  {
    url: '/api/login',
    timeout: 1000,
    method: 'POST',
    response: ({ body }) => {
      return resultPageSuccess({});
    },
  },
] as MockMethod[];
```
