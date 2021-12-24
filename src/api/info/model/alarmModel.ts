export enum AlarmStatusEnum {
  /** 待处理 */
  UNDONE = 1,
  /** 已处理/处理完毕 */
  DONE = 2,
  /** 已报修 */
  REPAIRED = 3,
  /** 已关闭 */
  CLOSED = 4,
}

export interface GetAlarmsListParam {
  /** 是否正序 */
  ascending: boolean;
  /** 模糊查询：工艺号/对象名称/报警内容 */
  globalName: string;
  /** 报警类别 */
  kind: string;
  /** 报警级别 */
  level: string;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码 */
  pageNo: number;
  /** 每页多少条记录 0表示不分页 */
  pageSize: number;
  /** 状态 */
  status: number;
  /** 报警来源 */
  warningSource: string;
}

export interface GetAlarmsListResultModel {
  items: Nullable<AlarmObjectModel[]>;
  /** 数据总条数 */
  totalCount: number;
  /** 数据总页数 */
  totalPages: number;
}

export interface AlarmObjectModel {
  /** 报警内容 */
  alarmContent: string;
  /** 创建时间 */
  createTime: number;
  /** 创建者编号 */
  createUserId: number;
  /** 报警结束时间 */
  endTime: 0;
  /** 处理描述 */
  handlingDesc: string;
  /** 处理时间 */
  handlingTime: number;
  /** 处理人标识 */
  handlingUserId: number;
  /** 标识符 */
  id: number;
  /** 报警类别 */
  kind: string;
  /** 报警级别 */
  level: string;
  /** 报修单号 */
  maintenanceCode: string;
  /** 报修意见 */
  maintenanceOpinions: string;
  /** 操作状态 */
  optionStatus: number;
  /** 点位内容 */
  pointContent: string;
  /** 点位类型 */
  pointType: number;
  /** 关联设备类型图标 */
  relativeDeviceCategoryIcon: string;
  /** 报警对象标识符(配点对象标识或设备标识) */
  relativeObjectId: number;
  /** 报警对象名称(配点对象或设备) */
  relativeObjectName: string;
  /** 报警对象类型(1、配点对象，2、设备) */
  relativeObjectType: number;
  /** 报警开始时间 */
  startTime: number;
  /** 点位绝对路径 */
  uniPath: string;
  /** 更新时间 */
  updateTime: number;
  /** 更新者编号 */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
  /** 报警来源 */
  warningSource: string;
}

export interface UpdateAlarmsOperationsParam {
  /** 处理描述 */
  handlingDesc: string;
  /** 处理人id */
  handlingUserId?: number;
  /** 主键标识符 */
  id: number;
  /** 报警状态 */
  optionStatus: AlarmStatusEnum;
  /** 版本控制 */
  versionTag: string;
}

export interface UpdateAlarmsOperationsResultModel {
  code: number;
}

export interface AlarmsObjectAdvanceModel extends AlarmObjectModel {
  /** 处理人名称 */
  handlingUserName: string;
}
