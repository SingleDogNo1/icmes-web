import { defHttp } from '/@/utils/http/axios';
import { GetApprovalListParams, GetApprovalListResultModel } from './model/approvalModel';

enum Api {
  baseUrl = '/notice/approvals/',
}

/** 审批列表查询--作者：*/
export function getApprovalsListApi(params: GetApprovalListParams) {
  return defHttp.post<GetApprovalListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
