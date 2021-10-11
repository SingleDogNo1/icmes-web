import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { PublicKeyModel, LoginParams, LoginResultModel, resetPwdParams } from './model/userModel';

enum Api {
  /** 获取publicKey */
  getPublicKey = '/account/publicKey',
  /** 系统登录 */
  Login = '/account/login',
  resetPwd = '/account/password/initialize',
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

export function resetPwdApi(params: resetPwdParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.put(
    {
      url: Api.resetPwd,
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
