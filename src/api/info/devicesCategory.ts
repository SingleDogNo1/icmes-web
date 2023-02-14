import { defHttp } from '/@/utils/http/axios';
import {
  GetDevicesCategoryListParam,
  GetDevicesCategoryListResultModel,
} from './model/devicesCategoryModel';
import { formatUrl } from '/@/utils/helper/urlHelper';

enum Api {
  baseUrl = '/info/deviceCategory/',
}

/** 设备类型查询--作者：王宇清 */
export function getDevicesCategoryListApi(params: GetDevicesCategoryListParam) {
  const url = Api.baseUrl + 'list/';
  return defHttp.get<GetDevicesCategoryListResultModel>({
    url: formatUrl(url, params as unknown as { [index: string]: string }),
  });
}
