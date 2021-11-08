import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  PermissionResultModel,
  GetAccountListParams,
  GetAccountListModel,
  EditAccountParams,
  EditAccountResultModel,
  EmployeeBaseModel,
} from './model/basicModel';

enum Api {
  /** 获取当前用户权限--作者：徐宏亮 */
  getPermission = '/account/permission',
  /** 获取当前用户权限--作者：徐宏亮 */
  getAccountList = '/account/list/',
  /** 增删改查账号 */
  editAccount = '/account/',
  /** 通过工号获取账号详情--作者：孔轩 */
  getAccountInfoById = '/account/info/',
}

export function getPermissionApi(mode: ErrorMessageMode = 'message') {
  return defHttp.get<PermissionResultModel>({ url: Api.getPermission }, { errorMessageMode: mode });
}

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

export function addAccountApi(params: EditAccountParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<EditAccountResultModel>(
    {
      url: Api.editAccount,
      params,
    },
    { errorMessageMode: mode },
  );
}

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

export function deleteAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<EditAccountResultModel>(
    { url: Api.editAccount + id },
    { errorMessageMode: mode },
  );
}

export function getAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<EmployeeBaseModel>({ url: Api.editAccount + id }, { errorMessageMode: mode });
}

export function getAccountByCodeApi(params: { code: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.post<EmployeeBaseModel>(
    { url: Api.getAccountInfoById, params },
    { errorMessageMode: mode },
  );
}

export function lockAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/lock' },
    { errorMessageMode: mode },
  );
}

export function unlockAccountByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/unlock' },
    { errorMessageMode: mode },
  );
}

export function resetPasswordByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/password/reset' },
    { errorMessageMode: mode },
  );
}

export function resetFaceByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditAccountResultModel>(
    { url: Api.editAccount + id + '/face/reset' },
    { errorMessageMode: mode },
  );
}
