import { defHttp } from '/@/utils/http/axios';
import { GetProcessListParam, GetProcessListResultModel } from './model/processModel';

enum Api {
  baseUrl = '/info/process',
}

/** 获取工艺列表-作者：迟山 */
export function getProcessListApi(params: GetProcessListParam) {
  return defHttp.post<GetProcessListResultModel>({
    url: Api.baseUrl + '/list',
    params,
  });
}
