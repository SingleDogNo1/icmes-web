import { defHttp } from '/@/utils/http/axios';
import { GetApprovalListParams, GetApprovalListResultModel } from './model/approvalModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  approvalList = '/notice/approvals/list/',
}

/** 审批列表查询--作者：*/
export function getApprovalsListApi(
  params: GetApprovalListParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<GetApprovalListResultModel>(
    {
      url: Api.approvalList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
