import { defHttp } from '/@/utils/http/axios';
import { SparePartModel } from './model/sparePartModel';

enum Api {
  baseUrl = '/info/spareParts/',
}

/** 查询备件详细（仅仅是备件）-作者：lrq */
export function getSparePartDetailApi({ id }: { id: number }) {
  return defHttp.get<SparePartModel>({
    url: Api.baseUrl + 'detail/' + id,
  });
}
