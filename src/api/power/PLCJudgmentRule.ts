import { defHttp } from '/@/utils/http/axios';
import {
  GetPLCJudgmentRuleListParams,
  GetPLCJudgmentRuleListResultModel,
  ReqPLCJudgmentRuleParams,
} from './model/PLCJudgmentRuleModel';

enum Api {
  baseUrl = '/power/judgment/',
}

/** 创建plc判断规则列表-作者：李辉 */
export function createPLCJudgmentApi(params: ReqPLCJudgmentRuleParams) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改plc判断规则列表-作者：李辉 */
export function editPLCJudgmentApi(id: number, params: ReqPLCJudgmentRuleParams) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 获取plc判断规则列表-作者：李辉 */
export function getPLCJudgmentListApi(params: GetPLCJudgmentRuleListParams) {
  return defHttp.post<GetPLCJudgmentRuleListResultModel>({
    url: Api.baseUrl + 'list',
    params,
  });
}

/** 切换不检测plc是否提示-作者：李辉 */
export function togglePLCJudgmentTipsApi(id: number) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl + 'toggle/isTips/' + id,
  });
}

/** 启用停用plc判断规则-作者：李辉 */
export function togglePLCJudgmentUseApi(id: number) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl + 'toggle/inuse/' + id,
  });
}
