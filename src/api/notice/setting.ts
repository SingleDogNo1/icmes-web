import { defHttp } from '/@/utils/http/axios';
import {
  GetNoticeSettingConfigListParams,
  GetNoticeSettingConfigListResultModel,
} from './model/settingModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  settingConfig = '/notice/setting/config/list/',
}

export function getNoticeSettingConfigList(
  params: GetNoticeSettingConfigListParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<GetNoticeSettingConfigListResultModel>(
    { url: Api.settingConfig, params },
    {
      errorMessageMode: mode,
    },
  );
}
