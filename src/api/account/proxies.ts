import { defHttp } from '/@/utils/http/axios';
import {
  addProxyParam,
  EditProxyResultModel,
  GetProxyResultModel,
  EditProxyParam,
} from './model/proxiesModel';

enum Api {
  editProxies = '/account/proxies/',
}

/** 新增指派代理 */
export function addProxyApi(params: addProxyParam) {
  return defHttp.post<EditProxyResultModel>({
    url: Api.editProxies,
    params,
  });
}

/** 查找指派代理 */
export function getProxiesByIdApi(id: number | string) {
  return defHttp.get<GetProxyResultModel>({
    url: Api.editProxies + id,
  });
}

/** 修改指派代理 */
export function EditProxyByIdApi(id: number | string, params: EditProxyParam) {
  return defHttp.put<EditProxyResultModel>({
    url: Api.editProxies + id,
    params,
  });
}

/** 删除指派代理 */
export function delProxyByIdApi(id: number | string) {
  return defHttp.delete<EditProxyResultModel>({
    url: Api.editProxies + id,
  });
}
