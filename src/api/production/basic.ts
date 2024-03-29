import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  DashboardRealTimeResultModel,
  GetProductionListParams,
  GetProductionListResultModel,
  ProductionAdvanceModel,
} from './model/basicModel';

enum Api {
  baseUrl = '/production/',
}

/** 获取当班实时产量 */
export function getDashboardRealTimeApi(mode: ErrorMessageMode = 'none') {
  return defHttp.get<DashboardRealTimeResultModel>(
    { url: Api.baseUrl + 'dashboard/realTime' },
    { errorMessageMode: mode },
  );
}

/** 产品管理查询列表--作者：王利宇 */
export function getProductionListApi(params: GetProductionListParams) {
  return defHttp.post<GetProductionListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 查询所有产品详细--作者：Daniel */
export function getAllProductionApi() {
  return defHttp.get<ProductionAdvanceModel[]>({
    url: Api.baseUrl + 'all',
  });
}
