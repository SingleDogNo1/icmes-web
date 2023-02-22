import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicesCategoryListParam,
  GetDevicesCategoryListResultModel,
  CreateDeviceCategoryParams,
  DeviceCategoryCollection,
  DeviceCategoryModel,
  UpdateDevicesCategoryParams,
} from './model/devicesCategoryModel';
import { formatUrl } from '/@/utils/helper/urlHelper';

enum Api {
  baseUrl = '/info/deviceCategory/',
}

/** 创建设备类型信息-作者：迟山 */
export function createDeviceCategoryApi(params: CreateDeviceCategoryParams) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl,
    params,
  });
}

/** 获取设备类型详细信息-作者：迟山 */
export function getDevicesCategoryApi(id: number) {
  return defHttp.get<DeviceCategoryModel>({
    url: Api.baseUrl + id,
  });
}

/** 修改设备类型详细信息-作者：迟山 */
export function updateDevicesCategoryApi(id: number, params: UpdateDevicesCategoryParams) {
  return defHttp.put<{ code: string }>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 删除设备类型信息-作者：迟山 */
export function delDevicesCategoryApi(id: number) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + id,
  });
}

/** 设备类型查询--作者：王宇清 */
export function getDeviceCategoryListApi(params: GetDevicesCategoryListParam) {
  return defHttp.post<DeviceCategoryCollection>({
    url: Api.baseUrl + 'list',
    params,
  });
}

/** 设备类型查询--作者：迟山 */
export function getDevicesCategoryListApi(params: Record<string, string>) {
  return defHttp.get<GetDevicesCategoryListResultModel>({
    url: formatUrl(Api.baseUrl + 'list/', params),
  });
}
