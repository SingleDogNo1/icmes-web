import { defHttp } from '/@/utils/http/axios';
import {
  AccountTreeParams,
  AccountTreeResultModel,
  OrganizationsListParams,
  OrganizationsListResultModel,
} from './model/organizationsModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 组织机构挂接人员查询树形结构 */
  accountTree = '/info/organizations/account/allTree/list/',
  /** 组织机构查询 */
  organizationsList = '/info/organizations/list/',
}

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
