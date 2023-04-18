import { defHttp } from '/@/utils/http/axios';
import {
  ReqProductionPlanCreateParams,
  ProductionPlanAdvanceModel,
  GetProductionPlanParams,
  ProductionPlanCollection,
} from './model/plan';

enum Api {
  baseUrl = '/production/plans/',
}

/** 新增生产计划--作者：王利宇 */
export function createProductionPlanApi(params: ReqProductionPlanCreateParams) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl,
    params,
  });
}

/** 生产计划查询详细--作者：梁勇帅 */
export function getProductionPlanApi(id) {
  return defHttp.get<ProductionPlanAdvanceModel>({
    url: Api.baseUrl + id,
  });
}

/** 修改生产计划--作者：王利宇 */
export function updateProductionPlanApi(id, params: ReqProductionPlanCreateParams) {
  return defHttp.put<{ code: string }>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 生产计划查询列表--作者：张瑞晗 */
export function getProductionPlanListApi(params: GetProductionPlanParams) {
  return defHttp.post<ProductionPlanCollection>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
