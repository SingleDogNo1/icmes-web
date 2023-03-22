import { defHttp } from '/@/utils/http/axios';
import {
  CreateProductionYearPlanParams,
  UpdateProductionYearPlanParams,
  GetProductionYearPlanParams,
  ProductionYearPlanAdvanceModel,
  ProductionYearPlanMonthFullModel,
  ProductionYearPlanCollection,
} from './model/yearPlanModel';

enum Api {
  baseUrl = '/production/yearplans/',
}

/** 创建生产年度计划--作者：孔轩 */
export function createYearPlanApi(params: CreateProductionYearPlanParams) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改生产年度计划--作者：孔轩 */
export function updateYearPlanApi(id: number, params: UpdateProductionYearPlanParams) {
  return defHttp.put<{ code: string }>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 删除生产年度计划--作者：孔轩 */
export function deleteYearPlanApi(id: number) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + id,
  });
}

/** 查询生产年度计划详情--作者：夏振华 */
export function getYearPlanDetailApi(id: number) {
  return defHttp.get<ProductionYearPlanAdvanceModel>({
    url: Api.baseUrl + 'detail/' + id,
  });
}

/** 查询生产年度计划每月详情--作者：夏振华 */
export function getYearPlanMonthDetailApi(id: number) {
  return defHttp.get<ProductionYearPlanMonthFullModel>({
    url: Api.baseUrl + 'detail/' + id + '/months',
  });
}

/** 生产计划查询列表--作者：夏振华 */
export function getyearPlansListApi(params: GetProductionYearPlanParams) {
  return defHttp.post<ProductionYearPlanCollection>({
    url: Api.baseUrl + 'list',
    params,
  });
}
