import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicesListParam,
  GetDevicesListResultModel,
  getDevicesPowerListParam,
  getDevicesPowerListResultModel,
  GetPowerCutDevicesListParam,
  GetPowerCutDevicesListResultModel,
} from './model/devicesModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  baseUrl = '/info/devices/',
}

/** 设备列表查询 */
export function getDevicesListApi(params: GetDevicesListParam) {
  return defHttp.post<GetDevicesListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

export function getPowerCutDevicesListApi(params: GetPowerCutDevicesListParam) {
  return defHttp.post<GetPowerCutDevicesListResultModel>({
    url: Api.baseUrl + 'list/power',
    params,
  });
}

/** 设备带电类型设备查询 */
export function getDevicesPowerListApi(
  params: getDevicesPowerListParam,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<getDevicesPowerListResultModel>(
    {
      url: `${Api.baseUrl}list/power`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
