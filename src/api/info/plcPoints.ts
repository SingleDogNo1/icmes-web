import { defHttp } from '/@/utils/http/axios';
import {
  GetPlcPointsTreeParams,
  GetPlcPointsListParams,
  PLCPointLeavesCollection,
  PLCPointCollection,
} from './model/plcPointsModel';

enum Api {
  baseUrl = '/info/plcPoints/',
}

/** 查询plc点位树数据列表（客户提供）--作者：张瑞晗 */
export function getPlcPointsTreeListApi(params: GetPlcPointsTreeParams) {
  return defHttp.post<PLCPointLeavesCollection>({
    url: Api.baseUrl + 'tree/list/',
    params,
  });
}

/** 查询已配信号点列表--作者：陈少义 */
export function getPlcPointsListApi(params: GetPlcPointsListParams) {
  return defHttp.post<PLCPointCollection>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

export function deletePlcPointsApi(ids: number[]) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + 'points',
    params: {
      ids,
    },
  });
}
