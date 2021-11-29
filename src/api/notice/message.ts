import { defHttp } from '/@/utils/http/axios';
import {
  GetNoticeListParam,
  GetNoticeListResultModel,
  MarkReadResultModel,
} from './model/messageModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  messages = '/notice/messages/',
}

/** 获取未读通知数--作者：梁勇帅 */
export function getNoticeListApi(params: GetNoticeListParam, mode: ErrorMessageMode = 'message') {
  return defHttp.post<GetNoticeListResultModel>(
    {
      url: Api.messages + 'list/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改消息已读状态, -1表示全部已读 */
export function readNoticeByIdApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<MarkReadResultModel>(
    {
      url: Api.messages + id + '/readed/',
    },
    {
      errorMessageMode: mode,
    },
  );
}
