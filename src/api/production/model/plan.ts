import { BasicFetchListResult } from '/@/api/model/baseModel';
import { ProductionBaseModel, ProductionPlanStatusEnum } from './basicModel';

export interface Production {
  /** 数量 */
  amount: number;
  /** 灰分 */
  ash: number;
  /** 产品标识 */
  id: number;
  /** 产率 */
  productivity: number;
  /** 单位 */
  unit: string;
}

export interface ReqProductionPlanCreateParams {
  /** 计划结束日期 */
  endDate: number;
  /** 备注 */
  memo: string;
  /** 生产计划-产品关联列表 */
  productionList: Production[];
  /** 计划开始日期 */
  startDate: number;
}

export interface ReqProductionPlanUpdateParams extends ReqProductionPlanCreateParams {
  /** 计划单号 */
  code: string;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface GetProductionPlanParams {
  /** 是否正序 */
  ascending: boolean;
  /** 是否根据当前日期查询 */
  currentDateFlag?: boolean;
  /** 计划结束日期 */
  endDate?: number;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码 */
  pageNo: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize: number;
  /** 计划开始日期 */
  startDate?: number;
}

export interface ProductionStatisticsModel {
  /** 产品编码 */
  code: string;
  /** 标识符 */
  id: number;
  /** 计划产品的总量 */
  planTotal: number;
  /** 实际产品的总量 */
  realTotal: number;
  /** 规格 */
  spec: string;
  /** 单位 */
  unit: string;
  /** 品种 */
  varieties: string;
}

export interface ProductionPlanStatisticsModel {
  /** 当前计划入洗量 */
  currentPlanWashing: number;
  /** 当前实际入洗量 */
  currentRealWashing: number;
  /** 计划入洗总量 */
  planWashingTotal: number;
  /** 产出产品的详细信息 */
  productionDetails: ProductionStatisticsModel[];
  /** 产品计划标识 */
  productionPlanId: number;
  /** 单位 */
  unit: string;
}

export interface ProductionPlanBaseModel {
  /** 计划单号 */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建UserID */
  createUserId: number;
  /** 计划结束日期 */
  endDate: number;
  /** 标识符 */
  id: number;
  /** 备注 */
  memo: string;
  /** 计划入洗总量 */
  planWashingTotal: number;
  /** 产品code号 */
  productionCode: string;
  /** 产品标识符 */
  productionId: number;
  /** 产品名字 */
  productionName: string;
  /** 计划开始日期 */
  startDate: number;
  statistics: ProductionPlanStatisticsModel;
  /** 当前计划状态 */
  status: ProductionPlanStatusEnum;
  /** 单位 */
  unit: string;
  /** 更新时间 */
  updateTime: number;
  /** 更新UserID */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface ProductionPlanRelatedProductionModel extends ProductionBaseModel {
  /** 数量 */
  amount: number;
  /** 灰分 */
  ash: number;
}

export interface ProductionPlanAdvanceModel
  extends Omit<ProductionPlanBaseModel, 'productionCode' | 'productionId'> {
  productionList: ProductionPlanRelatedProductionModel[];
  rateAccording: number[];
}

export type ProductionPlanCollection = BasicFetchListResult<ProductionPlanBaseModel>;

export interface ReqProductivityCalculationParams {
  items: ProductionPlanRelatedProductionModel[];
}

export interface ResProductivityCalculationModel {
  items: {
    /** 产品id */
    id: number;
    /** 产率 */
    productivity: number;
  }[];
}

export interface ReqProductionDataOperationStatisticsParams {
  /** 按时间排序 */
  ascending: boolean;
  /** 计划结束日期 */
  endDate: string;
  /** 计划开始日期 */
  startDate: string;
  /** 班次 */
  workShiftDetailId: number;
}

export interface ProductionDataOperationStatisticsPlanModel {
  amount: number;
  ash: number;
  code: string;
  endDate: string;
  id: number;
  memo: string;
  planWashingTotal: number;
  productionCode: string;
  productionGroup: string;
  productionId: number;
  productivity: number;
  startDate: string;
  type: number;
  unit: string;
  varieties: string;
}
export interface ProductionDataOperationStatisticsPlanModelCollection {
  list: Nullable<ProductionDataOperationStatisticsPlanModel>;
}
