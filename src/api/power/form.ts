import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { GetPowerCutFormListParams, GetPowerCutFormListResultModel } from './model/formModel';
import { PowerCutTodayCountModel } from './model/basicModel';

enum Api {
  baseUrl = '/power/form/',
}

/** 查询停电申请单列表 */
export function getPowerCutFormListApi(
  params: GetPowerCutFormListParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<GetPowerCutFormListResultModel>(
    {
      url: Api.baseUrl + 'list/web',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 查询当天各种状态的停电申请单数 */
export function getPowerCutTodayCountApi(mode: ErrorMessageMode = 'message') {
  return defHttp.get<PowerCutTodayCountModel>(
    {
      url: Api.baseUrl + 'count/today',
    },
    {
      errorMessageMode: mode,
    },
  );
}
