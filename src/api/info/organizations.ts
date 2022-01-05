import { defHttp } from '/@/utils/http/axios';
import {
  AccountTreeParams,
  AccountTreeResultModel,
  OrganizationsListParams,
  OrganizationsListResultModel,
  CreateOrganizationParams,
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

export function createOrganizationApi(
  params: CreateOrganizationParams,
  mode: ErrorMessageMode = 'modal',
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
