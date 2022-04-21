export interface GetPowerJudgmentParams {
  /** 正序倒序 **/
  ascending?: boolean;
  /** 排序列名 **/
  orderBy?: string;
  /** 当前页数 **/
  pageNo?: number;
  /** 每页条数 **/
  pageSize?: number;
  /** 停送电业务节点 **/
  powerBusinessNode?: string;
}

export interface PlcJudgmentRuleCollectionModal {
  items: Nullable<PlcJudgmentRuleModel[]>;
  totalCount: number;
  totalPages: number;
}

export enum DevicePLCDetectTypeEnum {
  /** 不检测状态信号 **/
  NONE = 0,
  /** 只监测运行状态 **/
  ONLY_RUNNING = 1,
  /** 只监测带电状态 **/
  ONLY_ELECTRIFIED = 2,
  /** 监测运行状态+带电状态 **/
  RUNNING_ELECTRIFIED = 3,
  /** 只监测就地状态   **/
  ONLY_LOCAL = 4,
  /** 参与停送电流程，无电工配电操作 **/
  NONE_DISTRIBUTION = 5,
  /** 不参与停送电流程 **/
  NONE_JOIN = 6,
  /** 监测运行状态+带电状态+就地状态 **/
  RUNNING_ELECTRIFIED_LOCAL = 7,
  /** 监测就地状态+运行状态 **/
  LOCAL_RUNNING = 8,
  /** 监测就地状态+带电状态 **/
  LOCAL_ELECTRIFIED = 9,
  /** 未知 **/
  UNKNOWN = -1,
}

export interface PlcJudgmentRuleModel {
  /** 描述 **/
  description: string;
  /** 校验未通过说明 **/
  explain: string;
  /** plc判断规则标识 **/
  id: number;
  /** 是否启用 **/
  inuse: boolean;
  /** 不检测plc是否提示 **/
  isTips: boolean;
  /** PLC检测类型 DevicePLCDetectTypeEnum **/
  plcDetectType: DevicePLCDetectTypeEnum;
  /** 业务节点 字典表 POWER_BUSINESS_NODE **/
  powerBusinessNode: number;
  /** 策略ID **/
  strategyId: number;
  /** 策略名称 **/
  strategyName: string;
  /** 策略编号 **/
  strategyNumber: string;
}
