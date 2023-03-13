export interface GetStockHistoryParams {
  /** 是否正序 */
  ascending?: boolean;
  /** 结束时间 */
  endDate: number;
  /** 领出人ID */
  leadOutEmployeeIds: number[];
  /** 排序字段 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 每页多少条数据(0 表示不分页) */
  pageSize?: number;
  /** 开始时间 */
  startDate: number;
  /** 备件类型代码 */
  typeId: number;
  /** 厂商ID */
  vendorId: number;
}
export interface GetSparePartStocksListByIdParams {
  /** 是否正序 */
  ascending?: boolean;
  /** 排序字段 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 每页多少条数据(0 表示不分页) */
  pageSize?: number;
}

export interface SparePartStockCollection {
  items: Nullable<SparePartStockHistoryFullModel[]>;
  totalCount: number;
  totalPages: number;
}

export enum LockFlagEnum {
  UNLOCK,
  LOCK,
}

export enum OccurrenceTypeEnum {
  OUT,
  IN,
}

export interface SparePartStockHistoryFullModel {
  /** 创建时间 */
  createTime: number;
  /** 创建账号标识符 */
  createUserId: number;
  /** 工艺标识符 */
  id: number;
  /** 领出人ID */
  leadOutEmployeeId: number;
  /** 领出人名 */
  leadOutEmployeeName: string;
  /** 锁定标识 */
  lockFlag: LockFlagEnum;
  /** 备注 */
  memo: string;
  /** 出入库日期 */
  occurrenceDate: number;
  /** 操作人名 */
  operatorName: string;
  /** 事由 */
  reason: string;
  /** 备件ID */
  sparePartId: number;
  /** 备件名称 */
  sparePartName: string;
  /** 备件类型名称 */
  sparePartTypeName: string;
  /** 出入库数 */
  stockNum: number;
  /** 出入库类型 */
  type: OccurrenceTypeEnum;
  /** 更新时间 */
  updateTime: number;
  /** 更新UserID */
  updateUserId: number;
  /** 厂家ID */
  vendorId: number;
  /** 厂商名称 */
  vendorName: string;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface CreateInStockParams {
  /** 日期 */
  occurrenceDate: number;
  /** 备件ID */
  sparePartId: number;
  /** 数量 */
  stockNum: number;
  /** 事由 */
  reason: string;
  /** 厂家ID */
  vendorId: number;
  /** 备注 */
  memo: string;
}

export interface UpdateInStockParams extends CreateInStockParams {
  /** 高并发版本控制号 */
  versionTag: string;
}

export interface CreateOutStockParams extends CreateInStockParams {
  /** 领出人ID */
  leadOutEmployeeId: number;
}

export interface UpdateOutStockParams extends CreateOutStockParams {
  /** 高并发版本控制号 */
  versionTag: string;
}

export interface SparePartStockHistoryAdvanceModel {
  /** 创建时间 */
  createTime: number;
  /** 创建UserID */
  createUserId: number;
  /** 逻辑删除标识（0：正常；1：删除） */
  deleteFlag: number;
  /** 出入库标识符 */
  id: number;
  /** 领出人ID */
  leadOutEmployeeId: number;
  /** 领出人名称 */
  leadOutEmployeeName: string;
  /** 锁定标识 */
  lockFlag: LockFlagEnum;
  /** 备注 */
  memo: string;
  /** 出入库日期 */
  occurrenceDate: number;
  /** 事由 */
  reason: string;
  /** 备件ID */
  sparePartId: number;
  /** 备件名称 */
  sparePartName: string;
  /** 出入库数 */
  stockNum: number;
  /** 出入库类型 */
  type: OccurrenceTypeEnum;
  /** 单位CODE */
  unit: string;
  /** 更新时间 */
  updateTime: number;
  /** 更新UserID */
  updateUserId: number;
  /** 厂家ID */
  vendorId: number;
  /** 厂商名称 */
  vendorName: string;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface UpdateSettingParams {
  /** 锁定天数 */
  lockDays: number;
}
