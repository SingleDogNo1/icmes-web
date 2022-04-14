import { defHttp } from '/@/utils/http/axios';
import {
  GetAlarmsListParam,
  GetAlarmsListResultModel,
  UpdateAlarmsOperationsParam,
  UpdateAlarmsOperationsResultModel,
  AlarmsObjectAdvanceModel,
} from './model/alarmModel';

enum Api {
  baseUrl = '/info/alarms/',
}

/** 报警看板列表查询 */
export function getAlarmsListApi(params: GetAlarmsListParam) {
  return defHttp.post<GetAlarmsListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 处理报警操作--作者：lrq */
export function updateAlarmsOperationsApi(params: UpdateAlarmsOperationsParam) {
  return defHttp.post<UpdateAlarmsOperationsResultModel>({
    url: Api.baseUrl + 'alarmObjectOperations',
    params,
  });
}

/** 报警对象查询详细--作者：zh xia */
export function getAlarmsDetailApi(id: number) {
  return defHttp.get<AlarmsObjectAdvanceModel>({
    url: Api.baseUrl + id,
  });
}
