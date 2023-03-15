import { defHttp } from '/@/utils/http/axios';
import { GetUnreadNoticeApiResultModel } from './model/basicModel';

enum Api {
  baseUrl = '/notice/',
}

/** 获取未读通知数--作者：梁勇帅 */
export function getUnreadNoticeApi() {
  return defHttp.get<GetUnreadNoticeApiResultModel>({
    url: Api.baseUrl + 'unreadNotificationNum',
  });
}
