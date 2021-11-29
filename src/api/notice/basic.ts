import { defHttp } from '/@/utils/http/axios';
import { GetUnreadNoticeApiResultModel } from './model/basicModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  alarmsList = '/notice/unreadNotificationNum',
}

/** 获取未读通知数--作者：梁勇帅 */
export function getUnreadNoticeApi(mode: ErrorMessageMode = 'message') {
  return defHttp.get<GetUnreadNoticeApiResultModel>(
    {
      url: Api.alarmsList,
    },
    {
      errorMessageMode: mode,
    },
  );
}
