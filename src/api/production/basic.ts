import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { DashboardRealTimeResultModel } from './model/basicModel';

enum Api {
  /** 获取当班实时产量 */
  dashboardRealTime = '/production/dashboard/realTime',
}

export function getDashboardRealTimeApi(mode: ErrorMessageMode = 'none') {
  return defHttp.get<DashboardRealTimeResultModel<string>>(
    { url: Api.dashboardRealTime },
    { errorMessageMode: mode },
  );
}
