import { defHttp } from '/@/utils/http/axios';
import { GetRoleListByIdParams, GetRoleListByIdParamsResultModel } from './model/rolesModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 账号角色列表查询 */
  getRoleListById = '/roles/list/',
}

export function getRolesListByIdApi(
  id: number | string,
  params: GetRoleListByIdParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<GetRoleListByIdParamsResultModel>(
    {
      url: `/account/${id}` + Api.getRoleListById,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
