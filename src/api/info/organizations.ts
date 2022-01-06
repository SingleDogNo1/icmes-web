import { defHttp } from '/@/utils/http/axios';
import {
  AccountTreeParams,
  AccountTreeResultModel,
  OrganizationsListParams,
  OrganizationsListResultModel,
  OrganizationParams,
  EditOrganizationsResultModel,
} from './model/organizationsModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  basicUrl = '/info/organizations',
  accountTree = '/info/organizations/account/allTree/list/',
  organizationsList = '/info/organizations/list/',
}

/** 组织机构挂接人员查询树形结构 */
export function getAllAccountTreeApi(
  params: AccountTreeParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<AccountTreeResultModel>(
    {
      url: Api.accountTree,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 组织机构查询 */
export function getOrganizationsListApi(
  params: OrganizationsListParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<OrganizationsListResultModel>(
    {
      url: Api.organizationsList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 新增组织机构 */
export function createOrganizationApi(
  params: OrganizationParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<EditOrganizationsResultModel>(
    {
      url: Api.basicUrl,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 编辑组织机构 */
export function editOrganizationApi(
  id: number,
  params: OrganizationParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<EditOrganizationsResultModel>(
    {
      url: `${Api.basicUrl}/${id}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 删除组织机构 */
export function delOrganizationApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<EditOrganizationsResultModel>(
    {
      url: `${Api.basicUrl}/${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}
