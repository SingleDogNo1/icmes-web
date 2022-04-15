import { defHttp } from '/@/utils/http/axios';
import {
  GetConfigurableObjectsListParam,
  GetConfigurableObjectsListResultModel,
  ConfigurableObjectModel,
  EditConfigurableObjectResultModel,
} from './model/configurableObjectModel';

enum Api {
  baseUrl = '/info/configurableObjects/',
}

/** 配点对象列表--作者：王利宇 */
export function getConfigurableObjectsListApi(params: GetConfigurableObjectsListParam) {
  return defHttp.post<GetConfigurableObjectsListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 配点对象详细-作者：王利宇 */
export function getConfigurableObjectsDetailApi(id: number) {
  return defHttp.get<ConfigurableObjectModel>({
    url: Api.baseUrl + id,
  });
}

/** 新增配点对象-作者：郑宇清 */
export function createConfigurableObjectApi(params: ConfigurableObjectModel) {
  return defHttp.post<EditConfigurableObjectResultModel>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改配点对象-作者：杨晓飞 */
export function editConfigurableObjectApi(id: number, params: ConfigurableObjectModel) {
  return defHttp.put<EditConfigurableObjectResultModel>({
    url: Api.baseUrl + id,
    params,
  });
}
