import { defHttp } from '/@/utils/http/axios';
import { GetReminderListParam, GetReminderListResultModel } from './model/reminderModel';

enum Api {
  baseUrl = '/flow/reminder/',
}

/** 获取任务通知列表-作者：王宇清 */
export function getReminderListApi(params: GetReminderListParam) {
  return defHttp.post<GetReminderListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
