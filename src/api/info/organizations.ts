import { defHttp } from '/@/utils/http/axios';
import {
  AccountTreeParams,
  AccountTreeResultModel,
  OrganizationsListParams,
  OrganizationsListResultModel,
  OrganizationParams,
  EditOrganizationsResultModel,
} from './model/organizationsModel';

enum Api {
  basicUrl = '/info/organizations',
  accountTree = '/info/organizations/account/allTree/list/',
  organizationsList = '/info/organizations/list/',
}

/** 组织机构挂接人员查询树形结构 */
export function getAllAccountTreeApi(params: AccountTreeParams) {
  return defHttp.post<AccountTreeResultModel>({
    url: Api.accountTree,
    params,
  });
}

/** 组织机构查询 */
export function getOrganizationsListApi(params: OrganizationsListParams) {
  return defHttp.post<OrganizationsListResultModel>({
    url: Api.organizationsList,
    params,
  });
}

/** 新增组织机构 */
export function createOrganizationApi(params: OrganizationParams) {
  return defHttp.post<EditOrganizationsResultModel>({
    url: Api.basicUrl,
    params,
  });
}

/** 编辑组织机构 */
export function editOrganizationApi(id: number, params: OrganizationParams) {
  return defHttp.put<EditOrganizationsResultModel>({
    url: `${Api.basicUrl}/${id}`,
    params,
  });
}

/** 删除组织机构 */
export function delOrganizationApi(id: number) {
  return defHttp.delete<EditOrganizationsResultModel>({
    url: `${Api.basicUrl}/${id}`,
  });
}
