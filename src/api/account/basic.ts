import { defHttp } from '/@/utils/http/axios';
import {
  PermissionResultModel,
  GetAccountListParams,
  GetAccountListModel,
  EditAccountParams,
  EditAccountResultModel,
  EmployeeBaseModel,
  DistributionRoleParams,
  FeatureModel,
  getAssignmentParams,
  getAssignmentAgentResultModel,
  getAssignmentProxiesResultModel,
  ChangePWDParams,
} from './model/basicModel';

import { GetRoleListByIdParams, GetRoleListByIdResultModel } from './model/rolesModel';

enum Api {
  baseUrl = '/account/',
}

/** 获取当前用户权限--作者：徐宏亮 */
export function getPermissionApi() {
  return defHttp.get<PermissionResultModel>({
    url: Api.baseUrl + 'permission',
  });
}

/** 获取账号列表--作者：徐宏亮 */
export function getAccountListApi(params: GetAccountListParams) {
  return defHttp.post<GetAccountListModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 创建账号--作者：徐宏亮 */
export function addAccountApi(params: EditAccountParams) {
  return defHttp.post<EditAccountResultModel>({
    url: Api.baseUrl,
    params,
  });
}

/** 编辑账号--作者：徐宏亮 */
export function editAccountApi(id: string | number, params: EditAccountParams) {
  return defHttp.put<EditAccountResultModel>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 删除账号--作者：张瑞晗 */
export function deleteAccountByIdApi(id: string | number) {
  return defHttp.delete<EditAccountResultModel>({ url: Api.baseUrl + id });
}

/** 获取账号详情--作者：徐宏亮 */
export function getAccountByIdApi(id: string | number) {
  return defHttp.get<EmployeeBaseModel>({ url: Api.baseUrl + id });
}

/** 通过工号获取账号详情--作者：孔轩 */
export function getAccountByCodeApi(params: { code: string }) {
  return defHttp.post<EmployeeBaseModel>({
    url: Api.baseUrl + 'info/',
    params,
  });
}

/** 锁定账号--作者：张瑞晗 */
export function lockAccountByIdApi(id: string | number) {
  return defHttp.put<EditAccountResultModel>({
    url: Api.baseUrl + id + '/lock',
  });
}
/** 解锁锁定账号--作者：张瑞晗 */
export function unlockAccountByIdApi(id: string | number) {
  return defHttp.put<EditAccountResultModel>({
    url: Api.baseUrl + id + '/unlock',
  });
}

/** 账号初始密码--作者：张瑞晗 */
export function resetPasswordByIdApi(id: string | number) {
  return defHttp.put<EditAccountResultModel>({
    url: Api.baseUrl + id + '/password/reset',
  });
}

/** 账号初始化脸部信息--作者：张瑞晗 */
export function resetFaceByIdApi(id: string | number) {
  return defHttp.put<EditAccountResultModel>({
    url: Api.baseUrl + id + '/face/reset',
  });
}

/** 账号角色列表查询--作者：张瑞晗 */
export function getRolesListByIdApi(id: number | string, params: GetRoleListByIdParams) {
  return defHttp.post<GetRoleListByIdResultModel>({
    url: `/account/${id}/roles/list/`,
    params,
  });
}

/** 用户角色编辑(分配角色)--作者：徐宏亮 */
export function distributionRoleByIdApi(id: string | number, params: DistributionRoleParams) {
  return defHttp.post<EditAccountResultModel>({
    url: Api.baseUrl + id + '/relation/role-organization',
    params,
  });
}

/** 账号角色删除--作者：张瑞晗 */
export function delRoleByIdApi(
  id: string | number,
  orgId: string | number,
  roleId: string | number,
) {
  return defHttp.delete<EditAccountResultModel>({
    url: Api.baseUrl + id + '/organizations/' + orgId + '/roles/' + roleId,
  });
}

/** 账号权限列表查询--作者：徐宏亮 */
export function getFeaturesListByIdApi(id: string | number) {
  return defHttp.get<FeatureModel[]>({
    url: Api.baseUrl + id + '/features/list',
  });
}

/** 账号指派代理人列表查询--作者：徐宏亮 */
export function getAssignmentAgentListApi(id: string, params: getAssignmentParams) {
  return defHttp.post<getAssignmentAgentResultModel>({
    url: Api.baseUrl + id + '/consignProxies/list/',
    params,
  });
}

/** 账号接手代理人查询--作者：张瑞晗 */
export function getAssignmentProxiesListApi(id: number, params: getAssignmentParams) {
  return defHttp.post<getAssignmentProxiesResultModel>({
    url: Api.baseUrl + id + '/assignProxies/list/',
    params,
  });
}

/** 上传头像--作者：徐宏亮 */
export function uploadAvatarApi(params: { name: string; file: string }) {
  const data = new FormData();
  const files = { name: params.name, content: params.file.substring(22) };
  data.append('files', JSON.stringify(files));

  return defHttp.post({
    url: Api.baseUrl + 'profile/avatar',
    params: data,
  });
}

/** 修改密码--作者：徐宏亮 */
export function changePasswordApi(params: ChangePWDParams) {
  return defHttp.put<EditAccountResultModel>({
    url: Api.baseUrl + '/password/',
    params,
  });
}
