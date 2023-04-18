import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface DashboardRealTimeResultModel {
  date: string;
  shiftName: string;
}

export interface GetProductionListParams {
  /** 是否正序 */
  ascending: boolean;
  /** 全局查询 */
  globalName?: string;
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
  /** 产品分组 */
  productionGroup?: string;
  /** 产品类型 */
  typeArr: number[];
}

export interface ProductionBaseModel {
  /** 产品编码 */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建UserID */
  createUserId: number;
  /** 标识符 */
  id: number;
  /** 接口对接产品信息 */
  interfaceProduction: string;
  /** 产品分组 */
  productionGroup: string;
  /** 质量指标描述 */
  qualityDesc: string;
  /** 规格 */
  spec: string;
  /** 物料类型: 0-原煤 1-洗选产品 2-半成品 */
  type: number;
  /** 单位 */
  unit: string;
  /** 更新时间 */
  updateTime: number;
  /** 更新UserID */
  updateUserId: number;
  /** 品种 */
  varieties: string;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export type GetProductionListResultModel = BasicFetchListResult<ProductionBaseModel>;

export interface ProductionAdvanceModel extends ProductionBaseModel {
  /** 质量指标详情 */
  qualityQuotas: ProductionRelatedQualityQuotaModel[];
  /** 使用标识符 */
  useFlag: boolean;
}

export interface ProductionRelatedQualityQuotaModel {
  /** 编码 */
  code: string;
  /** 质量指标ID */
  id: number;
  /** 名称 */
  name: string;
  operator: OperatorModel;
  /** 指标类型: 1-正常指标 2-其他指标 */
  type: number;
  /** 质量指标单位 */
  unitCode: string;
  value: string;
}

export interface OperatorModel {
  /** 运算符号编码 */
  code: string;
  /** 运算符号ID */
  id: number;
  /** 运算符号名称 */
  name: string;
}

/** 生产计划当前状态 */
export enum ProductionPlanStatusEnum {
  /** 待生产 */
  PENDING,
  /** 生产中 */
  DURING,
  /** 已结束 */
  END,
}
