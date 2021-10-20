import { defHttp } from '/@/utils/http/axios';
import { GetAlarmsListParam, GetAlarmsListResultModel } from './model/alarmModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 报警看板列表查询 */
  alarmsList = '/info/alarms/list/',
}

export function getAlarmsListApi(params: GetAlarmsListParam, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<GetAlarmsListResultModel>(
    {
      url: Api.alarmsList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
