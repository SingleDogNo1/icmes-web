import { defHttp } from '/@/utils/http/axios';
import {
  GetPowerCutConfigParams,
  PowerCutConfigResultModel,
  EditPowerCutConfigResultModel,
  PowerCutConfigModel,
  EditPowerCutConfigModel,
} from './model/powerCutConfigModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  baseUrl = '/info/powerCutConfig/',
}

/** 查询停送电类型配置 */
export function getPowerCutConfigListApi(
  params: GetPowerCutConfigParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<PowerCutConfigResultModel>(
    {
      url: Api.baseUrl + 'list/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 设置停送电类型配置是否启用 */
export function changePowerCutConfigUsefulApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<PowerCutConfigResultModel>(
    {
      url: Api.baseUrl + 'isUse/' + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 删除停送电类型配置 */
export function deletePowerCutConfigApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<EditPowerCutConfigResultModel>(
    {
      url: Api.baseUrl + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 查询停送电类型配置 */
export function getPowerCutConfigApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<PowerCutConfigModel>(
    {
      url: Api.baseUrl + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 新建停送电类型配置 */
export function createPowerCutConfigApi(
  params: EditPowerCutConfigModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<EditPowerCutConfigResultModel>(
    {
      url: Api.baseUrl,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改停送电类型配置 */
export function editPowerCutConfigApi(
  params: EditPowerCutConfigModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<EditPowerCutConfigResultModel>(
    {
      url: Api.baseUrl,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
