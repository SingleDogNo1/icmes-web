import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { DashboardRealTimeResultModel } from './model/basicModel';

enum Api {
  dashboardRealTime = '/production/dashboard/realTime',
}

/** 获取当班实时产量 */
export function getDashboardRealTimeApi(mode: ErrorMessageMode = 'none') {
  return defHttp.get<DashboardRealTimeResultModel<string>>(
    { url: Api.dashboardRealTime },
    { errorMessageMode: mode },
  );
}
