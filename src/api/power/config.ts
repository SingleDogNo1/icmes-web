import { defHttp } from '/@/utils/http/axios';
import { PowerCutConfigModel, UpdatePowerCutConfigParams } from './model/configModel';

enum Api {
  baseUrl = '/power/config/',
}

/** 获取停送电配置信息-作者：李辉 */
export function getPowerCutConfigApi() {
  return defHttp.get<PowerCutConfigModel>({
    url: Api.baseUrl,
  });
}

/** 更新停送电配置信息-作者：李辉 */
export function updatePowerCutConfigApi(params: UpdatePowerCutConfigParams) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}
