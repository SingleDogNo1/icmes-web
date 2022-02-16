import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicesListParam,
  GetDevicesListResultModel,
  getDevicesPowerListParam,
  getDevicesPowerListResultModel,
} from './model/devicesModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  devicesList = '/info/devices/list/',
}

/** 设备查询 */
export function getDevicesListApi(params: GetDevicesListParam, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<GetDevicesListResultModel>(
    {
      url: Api.devicesList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 设备带电类型设备查询 */
export function getDevicesPowerListApi(
  params: getDevicesPowerListParam,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<getDevicesPowerListResultModel>(
    {
      url: `${Api.devicesList}power`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
