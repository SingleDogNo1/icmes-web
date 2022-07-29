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
  orderBy: string;
  /** 当前页码 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
  /** 产品分组 */
  productionGroup?: string;
  /** 产品类型 */
  typeArr: number[];
}

export interface GetProductionListResultModel {
  items: Nullable<ProductionBaseModel[]>;
  totalCount: number;
  totalPages: number;
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
