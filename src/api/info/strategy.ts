import { defHttp } from '/@/utils/http/axios';
import {
  GetStrategyListParams,
  StrategyRuleModel,
  GetStrategyListResultModel,
  UpdateStrategyResultModel,
  UpdateStrategyRulesParams,
  EditStrategyParams,
} from './model/strategyModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  basicUrl = '/info/strategy/',
}

/** 查询策略 */
export function getStrategyListApi(
  params: GetStrategyListParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<GetStrategyListResultModel>(
    {
      url: Api.basicUrl + 'like',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 根据策略ID查询策略规则 */
export function getStrategyRuleByIdApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<StrategyRuleModel[]>(
    {
      url: Api.basicUrl + 'rule/' + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 设置策略是否启用 */
export function updateStrategyRuleUseableApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<UpdateStrategyResultModel>(
    {
      url: Api.basicUrl + 'isUse/' + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改策略规则 */
export function updateStrategyRulesApi(
  params: UpdateStrategyRulesParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<UpdateStrategyResultModel>(
    {
      url: Api.basicUrl + 'rule/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 创建策略 */
export function createStrategyApi(params: EditStrategyParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<UpdateStrategyResultModel>(
    {
      url: Api.basicUrl,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改策略 */
export function updateStrategyApi(params: EditStrategyParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<UpdateStrategyResultModel>(
    {
      url: Api.basicUrl,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
