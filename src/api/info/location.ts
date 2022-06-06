import { defHttp } from '/@/utils/http/axios';
import {
  GetLocationListParams,
  GetLocationListResultModel,
  LocationModel,
} from './model/locationModel';

enum Api {
  baseUrl = '/info/locations/',
}

/** 位置查询--作者：孔轩 */
export function getLocationListApi() {
  return defHttp.get<GetLocationListResultModel>({
    url: Api.baseUrl + 'list',
  });
}

/** 获取位置树--作者：孔轩 */
export function getLocationTreeApi(params: GetLocationListParams) {
  return defHttp.get<GetLocationListResultModel>({
    url: `${Api.baseUrl}list/parentId=${params.parentId}&orderBy=${params.orderBy}&ascending=${params.ascending}`,
  });
}

/** 获取位置表格详情--作者：孔轩 */
export function getLocationTableApi(params: GetLocationListParams) {
  return defHttp.get<GetLocationListResultModel>({
    url: `${Api.baseUrl}list/id=&name=&parentId=${params.parentId}&hierarchy=${params.hierarchy}&orderBy=${params.orderBy}&ascending=${params.ascending}&pageSize=${params.pageSize}&pageNo=${params.pageNo}`,
  });
}

/** 创建位置信息--作者：孔轩 */
export function createLocationApi(params: LocationModel) {
  return defHttp.post<boolean>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改位置信息--作者：孔轩 */
export function editLocationApi(id: number, params: LocationModel) {
  return defHttp.put<boolean>({
    url: `${Api.baseUrl}/${id}`,
    params,
  });
}

/** 删除位置信息--作者：孔轩 */
export function delLocationApi(id: number) {
  return defHttp.delete<boolean>({
    url: `${Api.baseUrl}/${id}`,
  });
}
