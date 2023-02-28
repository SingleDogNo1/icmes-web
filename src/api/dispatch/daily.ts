import { defHttp } from '/@/utils/http/axios';
import { DispatchDailyTableModel } from './model/dailyModel';

enum Api {
  baseUrl = '/dispatch/daily/',
}

/** 获得调度日报报表数据--作者：罗致 */
export function getDispatchDailyReportApi(date: string) {
  return defHttp.get<DispatchDailyTableModel>({
    url: Api.baseUrl + date,
  });
}
