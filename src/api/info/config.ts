import { defHttp } from '/@/utils/http/axios';
import { RemoteConfigResultModel } from './model/configModel';

enum Api {
  baseUrl = '/info/configs/',
}

/** 获取系统配置信息 */
export function getRemoteConfigApi() {
  return defHttp.get<RemoteConfigResultModel>({
    url: Api.baseUrl + 'dict',
  });
}
