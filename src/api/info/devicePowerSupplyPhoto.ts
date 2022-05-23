import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicePowerSupplyPhotoListParams,
  DevicePowerSupplyPhotoCollection,
  DevicePowerSupplyPhotoBaseModel,
} from './model/devicePowerSupplyPhotoModel';

enum Api {
  baseUrl = '/info/devicePowerSupplyPhoto/',
}

/** 新建供电系统图--作者：罗致 */
export function createDevicePowerSupplyPhotoApi(params: DevicePowerSupplyPhotoBaseModel) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改供电系统图--作者：罗致 */
export function editDevicePowerSupplyPhotoApi(params: DevicePowerSupplyPhotoBaseModel) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}

/** 删除供电系统图--作者：罗致 */
export function deleteDevicePowerSupplyPhotoApi(id) {
  return defHttp.delete<{ code: number }>({
    url: Api.baseUrl + id,
  });
}

/** 供电系统图查询列表--作者：罗致 */
export function getDevicePowerSupplyPhotoListApi(params: GetDevicePowerSupplyPhotoListParams) {
  return defHttp.post<DevicePowerSupplyPhotoCollection>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
