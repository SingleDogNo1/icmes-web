import { defHttp } from '/@/utils/http/axios';
import {
  GetNoticeSettingConfigListParams,
  GetNoticeSettingConfigListResultModel,
  UpdateNoticeSettingConfigParams,
} from './model/settingModel';

enum Api {
  baseUrl = '/notice/setting/',
}

/** 获取通知配置列表-作者：王宇清 */
export function getNoticeSettingConfigListApi(params: GetNoticeSettingConfigListParams) {
  return defHttp.post<GetNoticeSettingConfigListResultModel>({
    url: Api.baseUrl + 'config/list/',
    params,
  });
}
/** 编辑通知配置-作者：王宇清 */
export function updateNoticeSettingConfigApi(params: UpdateNoticeSettingConfigParams) {
  return defHttp.put<boolean>({
    url: Api.baseUrl + 'config/' + params.tag,
    params,
  });
}
