import { AuthUserModel } from '/@/api/sys/model/userModel';

export interface GetCommercialCoalInspectionListParams {
  /** 正序倒序 */
  ascending: boolean;
  /** 检测批号 */
  batchNumber: string;
  /** 流向 */
  direction?: string;
  /** 发运日期–结束时间 */
  endTime: number;
  /** 产品 */
  globalName?: string;
  /** 运输方式: 0-火车 1-地销 2-自建数据 null-全部 */
  loadingType: number;
  /** 排序列名 */
  orderBy: string;
  /** 当前页数 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
  /** 产品标识 */
  productionId: number | string;
  /** 发运日期–开始时间 */
  startTime: number;
  /** 审核状态:  0-待审批 1-审批通过 2-审批驳回 3-作废 */
  status?: number;
  /** 是否只查询不合格 */
  unqualified: boolean;
  /** 是否只查询不稳定 */
  unstable: boolean;
  userModel?: AuthUserModel;
}

export interface GetCommercialCoalInspectionListResultModel {
  /** 批合格率 */
  batchQualifiedRate: number;
  /** 批稳定率 */
  batchStableRate: number;
  items: Nullable<CommercialCoalInspectionModel[]>;
  /** 饼图数据 */
  pieCharts: Nullable<ProductionCountRatePieChartModel[]>;
  synchroDataTime: number;
  totalCount: number;
  totalPages: number;
}

export interface CommercialCoalInspectionModel {
  /** 外灰 */
  aar: number;
  /** 内灰 */
  ad: number;
  /** 检测批号 */
  batchNumber: string;
  /** 扣水 */
  buckleWater: number;
  /** 焦型 */
  cokeType: number;
  /** 创建人员 */
  createUserId: number;
  /** 创建人员名称 */
  createUserName: string;
  /** 当前审批阶段名称 */
  currentProcessName: string;
  /** 是否有审批权限 */
  hasApprovalPermission: boolean;
  /** 标识符 */
  id: number;
  /** 检测日期 */
  inspectionDate: number;
  /** 是否为商品煤质检单提交人 */
  isOwner: boolean;
  loadingPlanBaseModel: LoadingPlanBaseModel;
  /** 装车计划id */
  loadingPlanId: number;
  /** 装车类型: 0-火车装车 1-地销装车 2-自建数据 */
  loadingType: number;
  /** 内水 */
  mad: number;
  /** 备注 */
  memo: string;
  /** 发热量 */
  mj: number;
  /** 全水 */
  mt: number;
  /** 分析基高位发热量 */
  qgrAd: number;
  /** 干燥基高位发热量 */
  qgrD: number;
  /** 收到基低位发热量 */
  qnetArCal: number;
  /** 收到基低位发热量 */
  qnetArMj: number;
  /**是否合格 0-不合格 1-合格 2-空 3-无 */
  qualified: number;
  /** 质量区间 */
  qualityRange: string;
  /** 是否稳定 0-不稳定 1-稳定 2-空 3-无 */
  stable: number;
  /** 审核状态 0-待审批 1-审批通过 2-审批驳回 3-作废 */
  status: number;
  /** 全硫 */
  std: number;
  /** 更新人员 */
  updateUserId: number;
  /**  挥发分var */
  var: number;
  /** 挥发分vdaf */
  vdaf: number;
  /**  用于高并发的数据版本控制 */
  versionTag: string;
}

export interface LoadingPlanBaseModel {
  /** 实际运吨 */
  actualTonnage: number;
  /** 矿别 */
  coalType: string;
  /** 流向 */
  direction: string;
  /** 装车计划id */
  id: number;
  /** 运输方式: 0-火车 1-地销 */
  loadingType: number;
  /** 装车计划号 */
  planNumber: string;
  /** 产品Id */
  productionId: number;
  productionVariety: string;
  /** 发运日期 */
  shipmentDate: number;
  /** 发运量 */
  tonnage: number;
  /** 车次 */
  trainNumber: string;
  /** 用户 */
  vendorName: string;
}

export interface ProductionCountRatePieChartModel {
  /** 产品所占比例 */
  prodictionRate: number;
  /** 产品数量 */
  productionCount: number;
  /** 产品Id */
  productionId: number;
  /** 产品名称 */
  productionName: string;
  /** 产品类型 */
  productionType: number;
}

export interface EditCommercialCoalInspectionParams {
  /** 外灰 */
  aar: number;
  /** 内灰 */
  ad: number;
  /** 检测批号 */
  batchNumber: string;
  /** 扣水 */
  buckleWater: number;
  /** 矿别 */
  coalType: string;
  /** 焦型 */
  cokeType: number;
  /** 流向 */
  direction: string;
  /** 检测日期 */
  inspectionDate: number;
  /** 装车计划号 */
  loadingPlanId: number;
  /** 装车类型: 0-火车装车 1-地销装车 2-自建数据 */
  loadingType: number;
  /** 内水 */
  mad: number;
  /** 备注 */
  memo: string;
  /** 发热量 */
  mj: number;
  /** 全水 */
  mt: number;
  /** （品种）产品标识 */
  productionId: number;
  /** 分析基高位发热量 */
  qgrAd: number;
  /** 干燥基高位发热量 */
  qgrD: number;
  /** 收到基低位发热量 */
  qnetArCal: number;
  /** 收到基低位发热量 */
  qnetArMj: number;
  /** 全硫 */
  std: number;
  /** 发运量 */
  tonnage: number;
  /**  挥发分var */
  var: number;
  /** 挥发分vdaf */
  vdaf: number;
  /**  用于高并发的数据版本控制 */
  versionTag: string;
}
