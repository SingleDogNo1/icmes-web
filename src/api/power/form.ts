import { defHttp } from '/@/utils/http/axios';
import {
  GetPowerCutFormListParams,
  GetPowerCutFormListResultModel,
  ExportPowerCutTicketResultModel,
} from './model/formModel';
import { PowerCutTodayCountModel, UpdatePowerCutFormResultModel } from './model/basicModel';

enum Api {
  baseUrl = '/power/form/',
}

/** 查询停电申请单列表 */
export function getPowerCutFormListApi(params: GetPowerCutFormListParams) {
  return defHttp.post<GetPowerCutFormListResultModel>({
    url: Api.baseUrl + 'list/web',
    params,
  });
}

/** 查询当天各种状态的停电申请单数 */
export function getPowerCutTodayCountApi() {
  return defHttp.get<PowerCutTodayCountModel>({
    url: Api.baseUrl + 'count/today',
  });
}

/** 新建人撤回 */
export function withdrawPowerCutFormApi(code: string) {
  return defHttp.post<UpdatePowerCutFormResultModel>({
    url: Api.baseUrl + 'cancel/' + code,
  });
}

/** 导出pdf */
export function exportPowerCutTicketApi(type: 'pdf' | 'zip', codes: string) {
  return defHttp.get<ExportPowerCutTicketResultModel>(
    {
      url: `${Api.baseUrl}export/${type}/${codes}`,
      responseType: 'arraybuffer',
    },
    {
      isReturnNativeResponse: true,
      isTransformResponse: false,
      formatDate: false,
      joinTime: false,
    },
  );
}
