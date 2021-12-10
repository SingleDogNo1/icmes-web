import { defHttp } from '/@/utils/http/axios';
import {
  GetNoticeSettingConfigListParams,
  GetNoticeSettingConfigListResultModel,
  UpdateNoticeSettingConfigParams,
} from './model/settingModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  settingConfig = '/notice/setting/config/',
}

/** 获取通知配置列表-作者：王宇清 */
export function getNoticeSettingConfigListApi(
  params: GetNoticeSettingConfigListParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<GetNoticeSettingConfigListResultModel>(
    { url: Api.settingConfig + 'list/', params },
    {
      errorMessageMode: mode,
    },
  );
}
/** 编辑通知配置-作者：王宇清 */
export function updateNoticeSettingConfigApi(
  params: UpdateNoticeSettingConfigParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.put<boolean>(
    { url: Api.settingConfig + params.tag, params },
    {
      errorMessageMode: mode,
    },
  );
}
