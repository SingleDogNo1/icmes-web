import { defHttp } from '/@/utils/http/axios';
import {
  GetRoleListByIdParams,
  GetRoleListByIdResultModel,
  GetRoleListParams,
  GetRoleListResultModel,
  AddRoleParams,
  AddRoleResultModel,
  EditRoleParams,
  EditRoleResultModel,
  GetFeaturesResultModel,
  GetAccountOrgParams,
  GetAccountOrgResultModel,
} from './model/rolesModel';
import { formatUrl } from '/@/utils/helper/urlHelper';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 账号角色列表查询 */
  getRoleListById = '/roles/list/',
  /** 角色列表查询 */
  getRolesList = '/account/roles/list/',
  /** 新增/删除/修改/查找角色 */
  editRole = '/account/roles',
}

export function getRolesListByIdApi(
  id: number | string,
  params: GetRoleListByIdParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<GetRoleListByIdResultModel>(
    {
      url: `/account/${id}` + Api.getRoleListById,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getRolesListApi(params: GetRoleListParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<GetRoleListResultModel>(
    {
      url: Api.getRolesList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function addRoleApi(params: AddRoleParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<AddRoleResultModel>(
    {
      url: Api.editRole,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function editRoleApi(
  id: number | string,
  params: EditRoleParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<EditRoleResultModel>(
    {
      url: Api.getRolesList + '/' + id,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getRoleFeaturesByIdApi(id: number | string, mode: ErrorMessageMode = 'message') {
  return defHttp.get<GetFeaturesResultModel[]>(
    {
      url: Api.editRole + '/' + id + '/features/list',
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getRolesUserListByIdApi(
  roleId: number | string,
  params: GetAccountOrgParams,
  mode: ErrorMessageMode = 'message',
) {
  const url = Api.editRole + '/' + roleId + '/account/list/';
  return defHttp.get<GetAccountOrgResultModel>(
    {
      url: formatUrl(url, params as unknown as { [index: string]: string }),
    },
    {
      errorMessageMode: mode,
    },
  );
}
