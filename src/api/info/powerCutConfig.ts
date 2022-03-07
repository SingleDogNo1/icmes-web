import { defHttp } from '/@/utils/http/axios';
import {
  GetPowerCutConfigParams,
  PowerCutConfigResultModel,
  EditPowerCutConfigResultModel,
  PowerCutConfigModel,
  EditPowerCutConfigModel,
} from './model/powerCutConfigModel';

enum Api {
  baseUrl = '/info/powerCutConfig/',
}

/** 查询停送电类型配置 */
export function getPowerCutConfigListApi(params: GetPowerCutConfigParams) {
  return defHttp.post<PowerCutConfigResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 设置停送电类型配置是否启用 */
export function changePowerCutConfigUsefulApi(id: number) {
  return defHttp.put<PowerCutConfigResultModel>({
    url: Api.baseUrl + 'isUse/' + id,
  });
}

/** 删除停送电类型配置 */
export function deletePowerCutConfigApi(id: number) {
  return defHttp.delete<EditPowerCutConfigResultModel>({
    url: Api.baseUrl + id,
  });
}

/** 查询停送电类型配置 */
export function getPowerCutConfigApi(id: number) {
  return defHttp.get<PowerCutConfigModel>({
    url: Api.baseUrl + id,
  });
}

/** 新建停送电类型配置 */
export function createPowerCutConfigApi(params: EditPowerCutConfigModel) {
  return defHttp.post<EditPowerCutConfigResultModel>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改停送电类型配置 */
export function editPowerCutConfigApi(params: EditPowerCutConfigModel) {
  return defHttp.put<EditPowerCutConfigResultModel>({
    url: Api.baseUrl,
    params,
  });
}
