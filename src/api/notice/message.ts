import { defHttp } from '/@/utils/http/axios';
import {
  GetNoticeListParam,
  GetNoticeListResultModel,
  MarkReadResultModel,
} from './model/messageModel';

enum Api {
  messages = '/notice/messages/',
}

/** 获取未读通知数--作者：梁勇帅 */
export function getNoticeListApi(params: GetNoticeListParam) {
  return defHttp.post<GetNoticeListResultModel>({
    url: Api.messages + 'list/',
    params,
  });
}

/** 修改消息已读状态, -1表示全部已读 */
export function readNoticeByIdApi(id: number) {
  return defHttp.put<MarkReadResultModel>({
    url: Api.messages + id + '/readed/',
  });
}
