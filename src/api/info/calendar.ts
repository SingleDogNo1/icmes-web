import { defHttp } from '/@/utils/http/axios';
import {
  GetCalendarStatisticsParam,
  GetCalendarStatisticsResultModel,
  UpdateCalendarStatisticsParam,
  UpdateCalendarStatisticsResultModel,
} from './model/calendarModel';

enum Api {
  basicApi = '/info/calanders/',
}

/** 日历查询 */
export function getCalendarsStatisticsApi(params: GetCalendarStatisticsParam) {
  return defHttp.post<GetCalendarStatisticsResultModel>({
    url: Api.basicApi + 'statistics/',
    params,
  });
}

/** 日历日期更新 */
export function updateCalendarsStatisticsApi(day: string, params: UpdateCalendarStatisticsParam) {
  return defHttp.put<UpdateCalendarStatisticsResultModel>({
    url: Api.basicApi + day,
    params,
  });
}
