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

enum Api {
  baseUrl = '/account/roles',
}

/** 角色查询列表--作者：张瑞晗 */
export function getRolesListApi(params: GetRoleListParams) {
  return defHttp.post<GetRoleListResultModel>({
    url: Api.baseUrl + '/list/',
    params,
  });
}

/** 角色新增--作者：张瑞晗 */
export function addRoleApi(params: AddRoleParams) {
  return defHttp.post<AddRoleResultModel>({
    url: Api.baseUrl,
    params,
  });
}

/** 角色修改--作者：张瑞晗 */
export function editRoleApi(id: number | string, params: EditRoleParams) {
  return defHttp.put<EditRoleResultModel>({
    url: Api.baseUrl + '/' + id,
    params,
  });
}

/** 角色删除--作者：张瑞晗 */
export function deleteRoleApi(id: number | string) {
  return defHttp.delete<boolean>({
    url: Api.baseUrl + '/' + id + '/force=true',
  });
}

/** 角色权限列表查询--作者：徐宏亮 */
export function getRoleFeaturesByIdApi(id: number | string) {
  return defHttp.get<GetFeaturesResultModel[]>({
    url: Api.baseUrl + '/' + id + '/features/list',
  });
}

/** 角色用户列表查询--作者：徐宏亮 */
export function getRolesUserListByIdApi(roleId: number | string, params: GetAccountOrgParams) {
  const url = Api.baseUrl + '/' + roleId + '/account/list/';
  return defHttp.get<GetAccountOrgResultModel>({
    url: formatUrl(url, params as unknown as { [index: string]: string }),
  });
}
