import { defHttp } from '/@/utils/http/axios';
import {
  GetPowerJudgmentParams,
  PlcJudgmentRuleModel,
  EditPowerJudgmentParams,
} from './model/plcJudgmentModel';

enum Api {
  baseUrl = '/power/judgment/',
}

/** 获取plc判断规则列表 **/
export function getPLCJudgmentListApi(params: GetPowerJudgmentParams) {
  return defHttp.post<PlcJudgmentRuleModel>({
    url: Api.baseUrl + 'list',
    params,
  });
}

/** 创建plc判断规则- **/
export function createPLCJudgmentApi(params: EditPowerJudgmentParams) {
  return defHttp.post<boolean>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改plc判断规则 **/
export function updatePLCJudgmentApi(params: GetPowerJudgmentParams, id: number) {
  return defHttp.put<boolean>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 删除plc判断规则 **/
export function deletePLCJudgmentApi(id: number) {
  return defHttp.delete<boolean>({
    url: Api.baseUrl + id,
  });
}

/** 启用/停用plc判断规则 **/
export function toggleInUseApi(id: number) {
  return defHttp.put<PlcJudgmentRuleModel>({
    url: Api.baseUrl + 'toggle/inuse/' + id,
  });
}

/** 切换不检测plc是否提示 **/
export function toggleIsTipsApi(id: number) {
  return defHttp.put<PlcJudgmentRuleModel>({
    url: Api.baseUrl + 'toggle/isTips/' + id,
  });
}
