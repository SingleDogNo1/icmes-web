import { defHttp } from '/@/utils/http/axios';
import { PublicKeyModel, LoginParams, LoginResultModel, resetPwdParams } from './model/userModel';

enum Api {
  baseUrl = '/account/',
}

/** 获取publicKey */
export function getPublicKeyApi() {
  return defHttp.get<PublicKeyModel>(
    {
      url: Api.baseUrl + 'publicKey',
    },
    { errorMessageMode: 'none' },
  );
}

/** 系统登录 */
export function loginApi(params: LoginParams) {
  return defHttp.post<LoginResultModel>({
    url: Api.baseUrl + 'login',
    params,
  });
}

/** 初始化密码--作者：徐宏亮 */
export function resetPwdApi(params: resetPwdParams) {
  return defHttp.put({
    url: Api.baseUrl + 'password/initialize',
    params,
  });
}

/** 系统登出 */
export function logoutApi() {
  return defHttp.get({ url: Api.baseUrl + 'exit' });
}
