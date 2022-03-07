import { defHttp } from '/@/utils/http/axios';
import { GetLogListParam, GetLogListResultModel } from './model/logModel';

enum Api {
  baseUrl = '/info/log/list/',
}

/** 获取操作日志列表 */
export function getLogListApi(params: GetLogListParam) {
  return defHttp.post<GetLogListResultModel>({
    url: Api.baseUrl,
    params,
  });
}
