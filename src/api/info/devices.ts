import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
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
  DeviceModel,
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
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
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

/** 删除设备信息-作者：戴常怡 */
export function delDeviceApi(id: number) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl + id,
  });
}

/** 批量导出二维码--作者：gbliang */
export function exportDeviceQRCodeApi(params: { deviceIds: number[] }) {
  return defHttp.post<BlobPart>({
    url: Api.baseUrl + 'qrcode/',
    params,
    responseType: 'blob',
  });
}

// 获取设备详细信息-作者：戴常怡
export function getDeviceDetailApi(id: number | string) {
  return defHttp.get<DeviceModel>({
    url: Api.baseUrl + id,
  });
}
