import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { GetPowerCutFormListParams, GetPowerCutFormListResultModel } from './model/formModel';
import { PowerCutTodayCountModel, UpdatePowerCutFormResultModel } from './model/basicModel';

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

/** 新建人撤回 */
export function withdrawPowerCutFormApi(code: string, mode: ErrorMessageMode = 'message') {
  return defHttp.post<UpdatePowerCutFormResultModel>(
    {
      url: Api.baseUrl + 'cancel/' + code,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 导出pdf */
export function exportPowerCutTicketApi(
  type: 'pdf' | 'zip',
  codes: string,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BlobPart>(
    {
      url: `${Api.baseUrl}export/${type}/${codes}/`,
      responseType: 'arraybuffer',
    },
    {
      errorMessageMode: mode,
    },
  );
}
