import { defHttp } from '/@/utils/http/axios';
import { GetLogListParam, GetLogListResultModel } from './model/logModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  systemLog = '/info/log/list/',
}

/** 获取操作日志列表 */
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
