import { defHttp } from '/@/utils/http/axios';
import {
  GetNoticeSettingConfigListParams,
  GetNoticeSettingConfigListResultModel,
  UpdateNoticeSettingConfigParams,
} from './model/settingModel';

enum Api {
  settingConfig = '/notice/setting/config/',
}

/** 获取通知配置列表-作者：王宇清 */
export function getNoticeSettingConfigListApi(params: GetNoticeSettingConfigListParams) {
  return defHttp.post<GetNoticeSettingConfigListResultModel>({
    url: Api.settingConfig + 'list/',
    params,
  });
}
/** 编辑通知配置-作者：王宇清 */
export function updateNoticeSettingConfigApi(params: UpdateNoticeSettingConfigParams) {
  return defHttp.put<boolean>({ url: Api.settingConfig + params.tag, params });
}
