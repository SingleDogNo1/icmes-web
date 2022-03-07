import { defHttp } from '/@/utils/http/axios';
import { RemoteConfigResultModel } from './model/configModel';

enum Api {
  systemConfig = '/info/configs/dict',
}

/** 获取系统配置信息 */
export function getRemoteConfigApi() {
  return defHttp.get<RemoteConfigResultModel>({
    url: Api.systemConfig,
  });
}
