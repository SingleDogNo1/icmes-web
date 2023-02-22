import { defHttp } from '/@/utils/http/axios';
import { SpecDataResultModel } from './model/specDataModel';

enum Api {
  baseUrl = '/info/specDatas/',
}

/** 获取所有规格类型和数据模版 */
export function getSpecDataListApi() {
  return defHttp.get<SpecDataResultModel[]>({
    url: Api.baseUrl + 'types',
  });
}
