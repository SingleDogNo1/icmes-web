import { defHttp } from '/@/utils/http/axios';
import { RemoteConfigResultModel } from './model/configModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 获取系统配置信息 */
  systemConfig = '/info/configs/dict',
}

export function getRemoteConfigApi(mode: ErrorMessageMode = 'modal') {
  return defHttp.get<RemoteConfigResultModel>(
    {
      url: Api.systemConfig,
    },
    {
      errorMessageMode: mode,
    },
  );
}
