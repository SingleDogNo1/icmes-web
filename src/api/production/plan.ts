import { defHttp } from '/@/utils/http/axios';
import {
  ReqProductionPlanCreateParams,
  ReqProductionPlanUpdateParams,
  ReqProductivityCalculationParams,
  ProductionPlanAdvanceModel,
  GetProductionPlanParams,
  ProductionPlanCollection,
  ResProductivityCalculationModel,
  ReqProductionDataOperationStatisticsParams,
  ProductionDataOperationStatisticsPlanModelCollection,
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
export function updateProductionPlanApi(id: number, params: ReqProductionPlanUpdateParams) {
  return defHttp.put<{ code: string }>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 删除生产计划--作者：杨晓飞 */
export function delProductionPlanApi(id: number) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + id,
  });
}

/** 生产计划查询列表--作者：张瑞晗 */
export function getProductionPlanListApi(params: GetProductionPlanParams) {
  return defHttp.post<ProductionPlanCollection>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 计算产率--作者：杨晓飞 */
export function calcProductionPlanProductivityApi(params: ReqProductivityCalculationParams) {
  return defHttp.post<ResProductivityCalculationModel>({
    url: Api.baseUrl + 'productivity',
    params,
  });
}

/** 获取生产计划、生产计划详细、产品关联--作者：Daniel */
export function getProductionPlanDetailProductionRelationApi(
  params: ReqProductionDataOperationStatisticsParams,
) {
  return defHttp.post<ProductionDataOperationStatisticsPlanModelCollection>({
    url: Api.baseUrl + 'queryProductionPlanDetailProductionRelation',
    params,
  });
}
