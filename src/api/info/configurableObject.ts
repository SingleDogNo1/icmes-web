import { defHttp } from '/@/utils/http/axios';
import {
  GetConfigurableObjectsListParam,
  GetConfigurableObjectsListResultModel,
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
