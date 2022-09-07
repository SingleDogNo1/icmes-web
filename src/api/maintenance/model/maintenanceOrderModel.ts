export interface GetMaintenanceOrdersParams {
  /** 是否正序 */
  ascending: boolean;
  /** 检修单code集合 */
  codes?: string[];
  /** 模糊查询关键字 */
  globalName: string;
  /** 模糊查询类型 */
  globalType: ['deviceName', 'processNo', 'maintenanceOrderCode'];
  /** 是否查询当前用户有关的检修单 */
  isCurrentUserRelatedOrder?: boolean;
  /** 是否值查询有权限数据 */
  isHasPermission: boolean;
  /** 只查询当前查询人在停电联系人中的检修单 */
  isOnlyPowerCutRole?: boolean;
  /** 检修单类型数组 */
  maintenanceTypeList?: string[];
  /** 排序的字段名 */
  orderBy: string;
  /** 责任班组ID数组 */
  orgIdList: number[];
  /** 当前页码数 */
  pageNo: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize: number;
  /** 计划开工时间的结尾时间 */
  planStartEndTime: number;
  /** 计划开工时间 */
  planStartTime: number;
  /** 状态 */
  status: string[];
}

export interface MaintenanceOrderCollection {
  items: Nullable<MaintenanceOrderAdvanceSimplifyModel[]>;
  totalPages: number;
  totalCount: number;
}

export interface MaintenanceOrderAdvanceSimplifyModel {
  /** 审批员工Id */
  approvalUserId: number;
  /** 检修单号 */
  code: string;
  /** 负责人标识符 */
  constructionEmployeeId: number;
  /** 施工负责人 */
  constructionEmployeeName: string;
  /** 创建时间 */
  createTime: number;
  /** 创建员工Id */
  createUserId: number;
  /** 取第一个设备的类型图标给前端显示 */
  deviceIcon: string;
  /** 设备标识列表 */
  deviceIds: number[];
  /** 设备列表 */
  devices: string[];
  /** 标识符 */
  id: number;
  /** 非设备信息 */
  nonDevice: string;
  /** 责任班组名称 */
  orgFullName: string;
  /** 责任班组ID */
  orgId: number;
  /** 计划开工时间 */
  planStartTime: number;
  /** 是否关联停电单 */
  powerCut: boolean;
  /** 停送电单标识 */
  powerCutNo: string;
  /** 停送电单状态 */
  powerCutStatus: string;
  /** 项目名称 */
  projectName: string;
  /** 检修单状态 */
  status: string;
  /** 更新时间 */
  updateTime: number;
  /** 修改员工Id */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}
