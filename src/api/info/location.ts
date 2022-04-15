import { defHttp } from '/@/utils/http/axios';
import { GetLocationListResultModel } from './model/locationModel';

enum Api {
  baseUrl = '/info/locations/',
}

/** 位置查询--作者：孔轩 */
export function getLocationListApi() {
  return defHttp.get<GetLocationListResultModel>({
    url: Api.baseUrl + 'list',
  });
}
