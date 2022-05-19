import { defHttp } from '/@/utils/http/axios';
import {
  PowerCutConfigModel,
  UpdatePowerCutConfigParams,
  ConfigReminderModel,
  ConfigReminderParams,
} from './model/configModel';

enum Api {
  baseUrl = '/power/config/',
}

/** 获取停送电配置信息-作者：李辉 */
export function getPowerCutConfigApi() {
  return defHttp.get<PowerCutConfigModel>({
    url: Api.baseUrl,
  });
}

/** 更新停送电配置信息-作者：李辉 */
export function updatePowerCutConfigApi(params: UpdatePowerCutConfigParams) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}

/** 更新异常消息通知配置-作者：李辉 */
export function updatePowerCutReminderConfigApi(id: number, params: ConfigReminderParams) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl + 'reminder/' + id,
    params,
  });
}

/** 删除异常消息通知配置-作者：李辉 */
export function deletePowerCutReminderConfigApi(id: number) {
  return defHttp.delete<{ code: number }>({
    url: Api.baseUrl + id,
  });
}

/** 查询异常消息通知配置(设备异常带电)-作者：李辉 */
export function getPowerCutConfigReminderApi() {
  return defHttp.get<Nullable<ConfigReminderModel[]>>({
    url: Api.baseUrl + 'reminder/power',
  });
}

/** 创建异常消息通知配置(设备异常带电)-作者：李辉 */
export function createPowerCutConfigReminderApi(params: ConfigReminderParams) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl + 'reminder/power',
    params,
  });
}

/** 查询异常消息通知配置(远操异常提醒)-作者：李辉 */
export function getRemotePowerCutConfigReminderApi() {
  return defHttp.get<Nullable<ConfigReminderModel[]>>({
    url: Api.baseUrl + 'reminder/remote',
  });
}

/** 创建异常消息通知配置(远操异常提醒)-作者：李辉 */
export function createRemotePowerCutConfigReminderApi(params: ConfigReminderParams) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl + 'reminder/remote',
    params,
  });
}
