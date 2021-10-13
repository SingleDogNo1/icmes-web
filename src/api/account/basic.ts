import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { PermissionResultModel } from './model/basicModel';

enum Api {
  /** 获取当前用户权限--作者：徐宏亮 */
  getPermission = '/account/permission',
}

export function getPermissionApi(mode: ErrorMessageMode = 'none') {
  return defHttp.get<PermissionResultModel>({ url: Api.getPermission }, { errorMessageMode: mode });
}
