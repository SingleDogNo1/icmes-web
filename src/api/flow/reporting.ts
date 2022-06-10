import { defHttp } from '/@/utils/http/axios';
import { GetReportingListParam, GetReportingListResultModel } from './model/reportingModel';

enum Api {
  baseUrl = '/flow/reporting/',
}

/** 获取任务上报列表-作者：王宇清 */
export function getReportingListApi(params: GetReportingListParam) {
  return defHttp.post<GetReportingListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
