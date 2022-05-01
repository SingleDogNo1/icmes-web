import { defHttp } from '/@/utils/http/axios';
import {
  GetPlcPointsTreeParams,
  GetPlcPointsListParams,
  PLCPointLeavesCollection,
  PLCPointCollection,
  UpdatePlcPointParams,
  PLCPointBaseModel,
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

/** plc配点批量删除-作者：梁勇帅 */
export function deletePlcPointsApi(ids: number[]) {
  return defHttp.delete<{ code: number }>({
    url: Api.baseUrl + 'points',
    params: {
      ids,
    },
  });
}

/** plc配点批量修改属性-作者：梁勇帅 */
export function updatePlcPointsApi(params: UpdatePlcPointParams) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}

/** plc配点详细-作者：梁勇帅 */
export function getPlcPointInfoApi(id: number) {
  return defHttp.get<PLCPointBaseModel>({
    url: Api.baseUrl + id,
  });
}
