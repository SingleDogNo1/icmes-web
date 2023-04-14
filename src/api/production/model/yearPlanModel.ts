import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface CreateMonthAmountParams {
  /** 计划量 */
  amount: number;
  /** 月份 */
  month: number;
}

export interface CreateYearPlanProductionParams {
  /** 灰分 */
  ash: number;
  /** 发热量 */
  mj: number;
  /** 水分 */
  moisture: number;
  /** 生产年度计划产品月计划 */
  monthAmounts: CreateMonthAmountParams[];
  /** 产品标识ID */
  productionId: number;
  /** 产率 */
  productivity: number;
}

export interface CreateProductionYearPlanParams {
  /** 备注说明 */
  memo: string;
  /** 计划入洗原煤（万吨） */
  planInTotalAmount: number;
  /** 计划产出精煤（万吨） */
  planOutTotalAmount: number;
  /** 年计划产品 */
  productions: CreateYearPlanProductionParams[];
  /** 计划年度 */
  year: number;
}

export type UpdateProductionYearPlanParams = CreateProductionYearPlanParams;

export interface ProductionYearPlanProductionAdvanceModel {
  /** 灰分 */
  ash: number;
  /** 创建时间 */
  createTime: number;
  /** 创建UserID */
  createUserId: number;
  /** 发热量 */
  mj: number;
  /** 水分 */
  moisture: number;
  /** 产品数量 */
  productAmount: number;
  /** 产品类型 */
  productType: number;
  /** 产品名称 */
  productVarieties: string;
  /** 产品分组 */
  productionGroup: string;
  /** 产品标识ID */
  productionId: number;
  /** 标识符 */
  productionYearPlanProductionId: number;
  /** 产率 */
  productivity: number;
  /** 更新时间 */
  updateTime: number;
  /** 更新UserID */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
  /** 年度计划标识符 */
  yearPlanId: number;
}
export interface ProductionYearPlanAdvanceModel extends ProductionYearPlanBaseModel {
  /** 年计划产品 */
  productions: ProductionYearPlanProductionAdvanceModel[];
}

export interface GetProductionYearPlanParams {
  /** 是否正序 */
  ascending?: boolean;
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
}

export interface ProductionYearPlanBaseModel {
  /** 精煤总计划产出 */
  cleanCoalAmount: number;
  /** 精煤总产率 */
  cleanCoalProductivity: number;
  /** 创建时间 */
  createTime: number;
  /** 创建UserID */
  createUserId: number;
  /** 标识符 */
  id: number;
  /** 备注 */
  memo: string;
  /** 计划入洗原煤 */
  planInTotalAmount: number;
  /** 计划产出精煤 */
  planOutTotalAmount: number;
  /** 产率 */
  productivity: number;
  /** 更新时间 */
  updateTime: number;
  /** 更新UserID */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
  /** 计划年度 */
  year: number;
}

export type ProductionYearPlanCollection = BasicFetchListResult<ProductionYearPlanBaseModel>;

export interface ProductionYearPlanProductionMonthAmountModel {
  /** 计划量 */
  amount: number;
  /** 月份 */
  month: number;
  /** 产品标识符 */
  productionId: number;
  /** 年度计划标识 */
  yearPlanId: number;
}

export interface ProductionYearPlanProductionFullModel
  extends ProductionYearPlanProductionAdvanceModel {
  monthAmounts: ProductionYearPlanProductionMonthAmountModel[];
}

export interface ProductionYearPlanMonthFullModel extends ProductionYearPlanBaseModel {
  /** 计划产品月份计划量详情 */
  monthProductions: ProductionYearPlanProductionFullModel[];
}
