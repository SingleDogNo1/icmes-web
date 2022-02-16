import { defHttp } from '/@/utils/http/axios';
import {
  GetCalendarStatisticsParam,
  GetCalendarStatisticsResultModel,
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
