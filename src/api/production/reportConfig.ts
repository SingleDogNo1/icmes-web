import { defHttp } from '/@/utils/http/axios';
import { ProductionListSettingModel } from './model/reportConfig';

enum Api {
  baseUrl = '/production/reportConfig/',
}

/** 查找所有未删除的生产清单 */
export function getProductionListApi() {
  return defHttp.get<ProductionListSettingModel[]>({
    url: Api.baseUrl + 'productList/list',
  });
}
