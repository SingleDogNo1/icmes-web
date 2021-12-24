import { defHttp } from '/@/utils/http/axios';
import {
  GetAlarmsListParam,
  GetAlarmsListResultModel,
  UpdateAlarmsOperationsParam,
  UpdateAlarmsOperationsResultModel,
  AlarmsObjectAdvanceModel,
} from './model/alarmModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  basicApi = '/info/alarms/',
  alarmsList = '/info/alarms/list/',
  alarmsOperations = '/info/alarms/alarmObjectOperations',
}

/** 报警看板列表查询 */
export function getAlarmsListApi(params: GetAlarmsListParam, mode: ErrorMessageMode = 'message') {
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

/** 处理报警操作--作者：lrq */
export function updateAlarmsOperationsApi(
  params: UpdateAlarmsOperationsParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<UpdateAlarmsOperationsResultModel>(
    {
      url: Api.alarmsOperations,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 报警对象查询详细--作者：zh xia */
export function getAlarmsDetailApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<AlarmsObjectAdvanceModel>(
    {
      url: Api.basicApi + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}
