import { defHttp } from '/@/utils/http/axios';
import { GetDispatchListParams, GetDispatchListResultModel } from './model/logModel';

enum Api {
  baseUrl = '/dispatch/',
}

/** 调度管理列表 */
export function getDispatchListApi(params: GetDispatchListParams) {
  return defHttp.post<GetDispatchListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 删除调度日志 */
export function delDispatchLogApi(id: number) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + 'log/' + id,
  });
}
