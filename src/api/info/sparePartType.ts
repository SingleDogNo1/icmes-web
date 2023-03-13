import { defHttp } from '/@/utils/http/axios';
import { GetSparePartTypesListParams, SparePartTypeCollection } from './model/sparePartTypeModel';

enum Api {
  baseUrl = '/info/sparePartTypes/',
}

/** 查询设备类型列表-作者：张瑞晗 */
export function getSparePartTypesListApi(params: GetSparePartTypesListParams) {
  return defHttp.post<SparePartTypeCollection>({
    url: Api.baseUrl + 'list',
    params,
  });
}
