import { defHttp } from '/@/utils/http/axios';
import { GetPowerJudgmentParams, PlcJudgmentRuleModel } from './model/plcJudgmentModel';

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
