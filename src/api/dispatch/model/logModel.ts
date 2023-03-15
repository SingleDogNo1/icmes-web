import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface GetDispatchListParams {
  /** 是否正序 */
  ascending?: boolean;
  /** 结束时间 */
  endTime?: string;
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码 */
  pageNo: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize: number;
  /** 开始时间 */
  startDate?: number[];
}

export interface DispatchLogModel {
  /** 创建人用户标识 */
  createUserId: number;
  /** 设备情况 */
  deviceSituation: string;
  /** 调度员工集合 */
  employeeItems: EmployeeBaseModel[];
  /** 交班人标识 */
  handoverEmployeeId: number;
  /** 交班人名称 */
  handoverEmployeeName: string;
  /** 交班时间 */
  handoverShiftTime: string;
  /** 调度日志标识 */
  id: number;
  /** 来源(是否是手动录入) */
  originType: number;
  /** 其他情况 */
  otherSituation: string;
  /** 人员情况 */
  personnelSituation: string;
  /** 工艺系统集合 */
  processItems: Nullable<DispatchProcessModel[]>;
  /** 生产日期 */
  productionDate: number;
  /** 生产情况 */
  productionSituation: string;
  /** 销售情况 */
  salesSituation: string;
  /** 交接班状态(来自数据字典) */
  status: string;
  /** 接班人标识 */
  successionEmployeeId: number;
  /** 接班人名称 */
  successionEmployeeName: string;
  /** 接班时间 */
  successionShiftTime: string;
  /** 更新人用户标识 */
  updateUserId: number;
  /** 班次标识 */
  workingShiftDetailId: number;
  workingShiftDetailModel: WorkingShiftDetailFullModel;
  /** 班次名称 */
  workingShiftDetailName: string;
}

export type GetDispatchListResultModel = BasicFetchListResult<DispatchLogModel>;

export interface EmployeeBaseModel {
  /** 员工工号Code */
  code: string;
  /** 员工标识Id */
  id: number;
  /** 员工姓名 */
  name: string;
  /** 员工所属组织机构 */
  organizationFullName: string;
  /** 员工所属组织机构编号 */
  organizationId: number;
  /** 员工所属组织机构名称 */
  organizationName: string;
}

export interface DispatchProcessModel {
  /** 工艺号标识 */
  processId: number;
  /** 工艺号名称 */
  processName: string;
  /** 系统法定开机时长 */
  systemOperationTime: number;
}

export interface WorkingShiftDetailFullModel {
  beScheduled: boolean;
  createUserId: number;
  effectiveTime: number;
  id: number;
  invalidTime: number;
  name: string;
  periodTime: number;
  productionShiftDate: string;
  showEndTime: number;
  showIsPreviousDay: boolean;
  showStartTime: number;
  startTime: number;
  updateUserId: number;
  workShiftId: number;
  workingShiftName: string;
}
