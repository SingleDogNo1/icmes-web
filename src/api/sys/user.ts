import { defHttp } from '/@/utils/http/axios';
import { PublicKeyModel, LoginParams, LoginResultModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 获取publicKey */
  getPublicKey = '/account/publicKey',
  /** 系统登录 */
  Login = '/account/login',
  /** 系统登出 */
  Logout = '/account/exit',
}

export function getPublicKeyApi() {
  return defHttp.get<PublicKeyModel>({ url: Api.getPublicKey }, { errorMessageMode: 'none' });
}

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function logoutApi() {
  return defHttp.get({ url: Api.Logout });
}
