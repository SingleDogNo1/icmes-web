import { defHttp } from '/@/utils/http/axios';
import {
  GetCalendarStatisticsParam,
  GetCalendarStatisticsResultModel,
  UpdateCalendarStatisticsParam,
  UpdateCalendarStatisticsResultModel,
} from './model/calendarModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  basicApi = '/info/calanders/',
}

/** 日历查询 */
export function getCalendarsStatisticsApi(
  params: GetCalendarStatisticsParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<GetCalendarStatisticsResultModel>(
    {
      url: Api.basicApi + 'statistics/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 日历日期更新 */
export function updateCalendarsStatisticsApi(
  day: string,
  params: UpdateCalendarStatisticsParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<UpdateCalendarStatisticsResultModel>(
    {
      url: Api.basicApi + day,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
