import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicePowerSupplyPhotoListParams,
  DevicePowerSupplyPhotoCollection,
} from './model/devicePowerSupplyPhotoModel';

enum Api {
  baseUrl = '/info/devicePowerSupplyPhoto/',
}

/** 供电系统图查询列表--作者：罗致 */
export function getDevicePowerSupplyPhotoListApi(params: GetDevicePowerSupplyPhotoListParams) {
  return defHttp.post<DevicePowerSupplyPhotoCollection>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
