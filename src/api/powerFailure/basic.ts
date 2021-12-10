import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { powerCutConfigListParams, powerCutConfigListResultModel } from './model/basicModel';

enum Api {
  /** 查询停送电类型配置 */
  powerCutConfigList = '/info/powerCutConfig/list',
}

export function getPowerCutConfigList(
  params: powerCutConfigListParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<powerCutConfigListResultModel>(
    {
      url: Api.powerCutConfigList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
