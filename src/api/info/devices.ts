import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicesListParam,
  GetDevicesListResultModel,
  GetPowerCutDevicesListParam,
  GetPowerCutDevicesListResultModel,
} from './model/devicesModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  baseApi = '/info/devices/',
}

/** 设备列表查询 */
export function getDevicesListApi(params: GetDevicesListParam, mode: ErrorMessageMode = 'message') {
  return defHttp.post<GetDevicesListResultModel>(
    {
      url: Api.baseApi + 'list/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getPowerCutDevicesListApi(
  params: GetPowerCutDevicesListParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<GetPowerCutDevicesListResultModel>(
    {
      url: Api.baseApi + 'list/power',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
