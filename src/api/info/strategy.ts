import { defHttp } from '/@/utils/http/axios';
import {
  GetStrategyListParams,
  StrategyRuleModel,
  GetStrategyListResultModel,
  UpdateStrategyResultModel,
  UpdateStrategyRulesParams,
  EditStrategyParams,
} from './model/strategyModel';

enum Api {
  basicUrl = '/info/strategy/',
}

/** 查询策略 */
export function getStrategyListApi(params: GetStrategyListParams) {
  return defHttp.post<GetStrategyListResultModel>({
    url: Api.basicUrl + 'like',
    params,
  });
}

/** 根据策略ID查询策略规则 */
export function getStrategyRuleByIdApi(id: number) {
  return defHttp.get<StrategyRuleModel[]>({
    url: Api.basicUrl + 'rule/' + id,
  });
}

/** 设置策略是否启用 */
export function updateStrategyRuleUseableApi(id: number) {
  return defHttp.put<UpdateStrategyResultModel>({
    url: Api.basicUrl + 'isUse/' + id,
  });
}

/** 修改策略规则 */
export function updateStrategyRulesApi(params: UpdateStrategyRulesParams) {
  return defHttp.put<UpdateStrategyResultModel>({
    url: Api.basicUrl + 'rule/',
    params,
  });
}

/** 创建策略 */
export function createStrategyApi(params: EditStrategyParams) {
  return defHttp.post<UpdateStrategyResultModel>({
    url: Api.basicUrl,
    params,
  });
}

/** 修改策略 */
export function updateStrategyApi(params: EditStrategyParams) {
  return defHttp.post<UpdateStrategyResultModel>({
    url: Api.basicUrl,
    params,
  });
}
