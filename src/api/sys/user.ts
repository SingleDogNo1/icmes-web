import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { PublicKeyModel, LoginParams, LoginResultModel, resetPwdParams } from './model/userModel';

enum Api {
  getPublicKey = '/account/publicKey',
  Login = '/account/login',
  resetPwd = '/account/password/initialize',
  Logout = '/account/exit',
}

/** 获取publicKey */
export function getPublicKeyApi() {
  return defHttp.get<PublicKeyModel>({ url: Api.getPublicKey }, { errorMessageMode: 'none' });
}

/** 系统登录 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'message') {
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

/** 初始化密码--作者：徐宏亮 */
export function resetPwdApi(params: resetPwdParams, mode: ErrorMessageMode = 'message') {
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

/** 系统登出 */
export function logoutApi() {
  return defHttp.get({ url: Api.Logout });
}
