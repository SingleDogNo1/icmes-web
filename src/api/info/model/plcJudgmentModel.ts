import { BasicFetchListResult } from '/@/api/model/baseModel';
import { DevicePLCDetectTypeEnum } from '/@/enums/plcJudgmentEnum';

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

export type PlcJudgmentRuleCollectionModal = BasicFetchListResult<PlcJudgmentRuleModel>;

export interface EditPowerJudgmentParams {
  /** 描述 **/
  description?: string;
  /** 校验未通过说明 **/
  explain?: string;
  /** PLC检测类型 DevicePLCDetectTypeEnum **/
  plcDetectType?: DevicePLCDetectTypeEnum;
  /** 业务节点 字典表-POWER_BUSINESS_NODE **/
  powerBusinessNode?: string;
  /** 策略ID **/
  strategyId?: number;
}
