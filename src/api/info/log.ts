import { defHttp } from '/@/utils/http/axios';
import { GetLogListParam, GetLogListResultModel } from './model/logModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 获取操作日志列表 */
  systemLog = '/info/log/list/',
}

export function getLogListApi(params: GetLogListParam, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<GetLogListResultModel>(
    {
      url: Api.systemLog,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
