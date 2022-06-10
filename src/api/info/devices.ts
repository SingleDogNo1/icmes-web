import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicesListParam,
  GetDevicesListResultModel,
  GetDevicesPowerListParam,
  GetDevicesPowerListResultModel,
  GetPowerCutDevicesListParam,
  GetPowerCutDevicesListResultModel,
  BatchUpdatePowerConfigParam,
  GetMoreCriterionDevicesParams,
  DeviceCollection,
  GetCamerasListParam,
  GetCamerasListResultModel,
} from './model/devicesModel';

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
export function getDevicesPowerListApi(params: GetDevicesPowerListParam) {
  return defHttp.post<GetDevicesPowerListResultModel>({
    url: `${Api.baseUrl}list/power`,
    params,
  });
}

/** 批量更新设备停送电配置- */
export function batchUpdatePowerConfigApi(params: BatchUpdatePowerConfigParam) {
  return defHttp.put<boolean>({
    url: `${Api.baseUrl}power/config`,
    params,
  });
}

/** 设备台帐---更多查询--作者：cxlu */
export function getMoreCriterionDevicesListApi(params: GetMoreCriterionDevicesParams) {
  return defHttp.post<DeviceCollection>({
    url: Api.baseUrl + 'moreCriterion/list/',
    params,
  });
}

/** 上传设备照片-作者： */
export function uploadDevicesPhotoApi(params) {
  return defHttp.post<{ fileId: string }>({
    url: Api.baseUrl + 'photo',
    params,
  });
}

/** 摄像头列表查询并同步-作者：张瑞晗 */
export function getCamerasListApi(params: GetCamerasListParam) {
  return defHttp.post<GetCamerasListResultModel>({
    url: Api.baseUrl + 'cameras/list/',
    params,
  });
}
