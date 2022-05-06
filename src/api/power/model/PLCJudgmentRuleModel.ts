import { DevicePLCDetectTypeEnum } from '/@/enums/PLCDetectTypeEnum';

export interface GetPLCJudgmentRuleListParams {
  /** 正序倒序 */
  ascending: boolean;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码数 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
  /** 停送电业务节点 */
  powerBusinessNode?: string;
}

export interface ReqPLCJudgmentRuleParams {
  /** 描述 */
  description: string;
  /** 校验未通过说明 */
  explain: string;
  /** PLC检测类型 */
  plcDetectType: DevicePLCDetectTypeEnum;
  /** 业务节点 */
  powerBusinessNode: string;
  /** 策略ID */
  strategyId: number;
}

export interface GetPLCJudgmentRuleListResultModel {
  items: Nullable<PlcJudgmentRuleModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface PlcJudgmentRuleModel extends ReqPLCJudgmentRuleParams {
  /** plc判断规则标识 */
  id: number;
  /** 是否启用 */
  inuse: boolean;
  /** 不检测plc是否提示 */
  isTips: boolean;
  /** 策略名称 */
  strategyName: string;
  /** 策略编号 */
  strategyNumber: string;
}
