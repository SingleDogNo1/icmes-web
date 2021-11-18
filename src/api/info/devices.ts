import { defHttp } from '/@/utils/http/axios';
import { GetDevicesListParam, GetDevicesListResultModel } from './model/devicesModel';

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
