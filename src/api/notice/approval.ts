import { defHttp } from '/@/utils/http/axios';
import { GetApprovalListParams, GetApprovalListResultModel } from './model/approvalModel';

enum Api {
  approvalList = '/notice/approvals/list/',
}

/** 审批列表查询--作者：*/
export function getApprovalsListApi(params: GetApprovalListParams) {
  return defHttp.post<GetApprovalListResultModel>({
    url: Api.approvalList,
    params,
  });
}
