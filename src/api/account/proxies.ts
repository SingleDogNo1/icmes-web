import { defHttp } from '/@/utils/http/axios';
import {
  addProxyParam,
  EditProxyResultModel,
  GetProxyResultModel,
  EditProxyParam,
} from './model/proxiesModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  editProxies = '/account/proxies/',
}
/** 新增指派代理 */
export function addProxyApi(params: addProxyParam, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<EditProxyResultModel>(
    {
      url: Api.editProxies,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/** 查找指派代理 */
export function getProxiesByIdApi(id: number | string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<GetProxyResultModel>(
    {
      url: Api.editProxies + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改指派代理 */
export function EditProxyByIdApi(
  id: number | string,
  params: EditProxyParam,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.put<EditProxyResultModel>(
    {
      url: Api.editProxies + id,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 删除指派代理 */
export function delProxyByIdApi(id: number | string, mode: ErrorMessageMode = 'modal') {
  return defHttp.delete<EditProxyResultModel>(
    {
      url: Api.editProxies + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}
