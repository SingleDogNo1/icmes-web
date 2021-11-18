import { defHttp } from '/@/utils/http/axios';
import { GetAlarmsListParam, GetAlarmsListResultModel } from './model/alarmModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  alarmsList = '/info/alarms/list/',
}

/** 报警看板列表查询 */
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
