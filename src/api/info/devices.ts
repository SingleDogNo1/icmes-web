import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicesListParam,
  GetDevicesListResultModel,
  GetDevicesPowerListParam,
  GetDevicesPowerListResultModel,
  GetPowerCutDevicesListParam,
  GetPowerCutDevicesListResultModel,
  BatchUpdatePowerConfigParam,
} from './model/devicesModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  baseApi = '/info/devices/',
}

/** 设备列表查询 */
export function getDevicesListApi(params: GetDevicesListParam) {
  return defHttp.post<GetDevicesListResultModel>({
    url: Api.baseApi + 'list/',
    params,
  });
}

export function getPowerCutDevicesListApi(params: GetPowerCutDevicesListParam) {
  return defHttp.post<GetPowerCutDevicesListResultModel>({
    url: Api.baseApi + 'list/power',
    params,
  });
}

/** 设备带电类型设备查询 */
export function getDevicesPowerListApi(
  params: GetDevicesPowerListParam,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<GetDevicesPowerListResultModel>(
    {
      url: `${Api.baseApi}list/power`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 批量更新设备停送电配置- */
export function batchUpdatePowerConfigApi(
  params: BatchUpdatePowerConfigParam,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.put<boolean>(
    {
      url: `${Api.baseApi}power/config`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
