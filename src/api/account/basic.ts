import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
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
  getPermission = '/account/permission',
  getAccountList = '/account/list/',
  editAccount = '/account/',
  uploadAvatar = '/account/profile/avatar',
  getAccountInfoById = '/account/info/',
}

/** 获取当前用户权限--作者：徐宏亮 */
export function getPermissionApi(mode: ErrorMessageMode = 'message') {
  return defHttp.get<PermissionResultModel>({ url: Api.getPermission }, { errorMessageMode: mode });
}

/** 获取账号列表--作者：徐宏亮 */
export function getAccountListApi(
  params: GetAccountListParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<GetAccountListModel>(
    {
      url: Api.getAccountList,
      params,
    },
    { errorMessageMode: mode },
  );
}

/** 创建账号--作者：徐宏亮 */
export function addAccountApi(params: EditAccountParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<EditAccountResultModel>(
    {
      url: Api.editAccount,
      params,
    },
    { errorMessageMode: mode },
  );
}

/** 编辑账号--作者：徐宏亮 */
export function editAccountApi(
  id: string | number,
  params: EditAccountParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<EditAccountResultModel>(
    {
      url: Api.editAccount + id,
      params,
    },
    { errorMessageMode: mode },
  );
}

/** 删除账号--作者：张瑞晗 */
export function deleteAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<EditAccountResultModel>(
    { url: Api.editAccount + id },
    { errorMessageMode: mode },
  );
}

/** 获取账号详情--作者：徐宏亮 */
export function getAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<EmployeeBaseModel>({ url: Api.editAccount + id }, { errorMessageMode: mode });
}

/** 通过工号获取账号详情--作者：孔轩 */
export function getAccountByCodeApi(params: { code: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.post<EmployeeBaseModel>(
    { url: Api.getAccountInfoById, params },
    { errorMessageMode: mode },
  );
}

/** 锁定账号--作者：张瑞晗 */
export function lockAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/lock' },
    { errorMessageMode: mode },
  );
}
/** 解锁锁定账号--作者：张瑞晗 */
export function unlockAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/unlock' },
    { errorMessageMode: mode },
  );
}

/** 账号初始密码--作者：张瑞晗 */
export function resetPasswordByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/password/reset' },
    { errorMessageMode: mode },
  );
}

/** 账号初始化脸部信息--作者：张瑞晗 */
export function resetFaceByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/face/reset' },
    { errorMessageMode: mode },
  );
}

/** 账号角色列表查询--作者：张瑞晗 */
export function getRolesListByIdApi(
  id: number | string,
  params: GetRoleListByIdParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<GetRoleListByIdResultModel>(
    {
      url: `/account/${id}/roles/list/`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 用户角色编辑(分配角色)--作者：徐宏亮 */
export function distributionRoleByIdApi(
  id: string | number,
  params: DistributionRoleParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<EditAccountResultModel>(
    { url: Api.editAccount + id + '/relation/role-organization', params },
    { errorMessageMode: mode },
  );
}

/** 账号角色删除--作者：张瑞晗 */
export function delRoleByIdApi(
  id: string | number,
  orgId: string | number,
  roleId: string | number,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.delete<EditAccountResultModel>(
    { url: Api.editAccount + id + '/organizations/' + orgId + '/roles/' + roleId },
    { errorMessageMode: mode },
  );
}

/** 账号权限列表查询--作者：徐宏亮 */
export function getFeaturesListByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<FeatureModel[]>(
    { url: Api.editAccount + id + '/features/list' },
    { errorMessageMode: mode },
  );
}

/** 账号指派代理人列表查询--作者：徐宏亮 */
export function getAssignmentAgentListApi(
  id: string,
  params: getAssignmentParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<getAssignmentAgentResultModel>(
    { url: Api.editAccount + id + '/consignProxies/list/', params },
    { errorMessageMode: mode },
  );
}

/** 账号接手代理人查询--作者：张瑞晗 */
export function getAssignmentProxiesListApi(
  id: number,
  params: getAssignmentParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<getAssignmentProxiesResultModel>(
    { url: Api.editAccount + id + '/assignProxies/list/', params },
    { errorMessageMode: mode },
  );
}

/** 上传头像--作者：徐宏亮 */
export function uploadAvatarApi(
  params: { name: string; file: string },
  mode: ErrorMessageMode = 'message',
) {
  const data = new FormData();
  const files = { name: params.name, content: params.file.substring(22) };
  data.append('files', JSON.stringify(files));

  return defHttp.post(
    {
      url: Api.uploadAvatar,
      params: data,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改密码--作者：徐宏亮 */
export function changePasswordApi(params: ChangePWDParams, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    {
      url: Api.editAccount + '/password/',
      params,
    },
    { errorMessageMode: mode },
  );
}
