import { defHttp } from '/@/utils/http/axios';
import {
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

/** 角色查询列表--作者：张瑞晗 */
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

/** 角色新增--作者：张瑞晗 */
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

/** 角色修改--作者：张瑞晗 */
export function editRoleApi(
  id: number | string,
  params: EditRoleParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<EditRoleResultModel>(
    {
      url: Api.editRole + '/' + id,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 角色删除--作者：张瑞晗 */
export function deleteRoleApi(id: number | string, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<boolean>(
    {
      url: Api.editRole + '/' + id + '/force=true',
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 角色权限列表查询--作者：徐宏亮 */
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

/** 角色用户列表查询--作者：徐宏亮 */
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
