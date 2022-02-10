import { defHttp } from '/@/utils/http/axios';
import { RemoteConfigResultModel } from './model/configModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  systemConfig = '/info/configs/dict',
}

/** 获取系统配置信息 */
export function getRemoteConfigApi(mode: ErrorMessageMode = 'message') {
  return defHttp.get<RemoteConfigResultModel>(
    {
      url: Api.systemConfig,
    },
    {
      errorMessageMode: mode,
    },
  );
}
