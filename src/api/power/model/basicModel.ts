/** 设备分合闸状态指示灯颜色 */
export enum DeviceStatusLightEnum {
  RED = 1,
  GREEN = 2,
  PURPLE = 3,
  GRAY = 4,
  NONE = 5,
}

export interface PowerCutFormFullModel {
  /** 实际停电时间 */
  actualCutOffTime: number;
  /** 实际送电时间 */
  actualSupplyTime: number;
  /** 关联设备信息 */
  assDevices: Nullable<DeviceInfoModel[]>;
  /** 停电申请单号 */
  code: string;
  /** 联系人名称 */
  contactName: string;
  /** 联系人部门 */
  contactOrgName: string;
  /** 停送电联系人 */
  contactUserId: number;
  /** 停电内容 */
  content: string;
  /** 停电申请单创建时间 */
  createTime: number;
  /** 申请人标识符 */
  createUserId: number;
  /** 是否可执行 */
  executable: boolean;
  /** 是否需要填高压操作票 */
  hvFlag: boolean;
  /** 非常规设备信息 */
  irregularDevices: Nullable<DeviceInfoModel[]>;
  /** 主设备信息 */
  mainDevices: Nullable<DeviceInfoModel[]>;
  /** 所属部门 */
  organizationId: number;
  outerAssModel: OuterAssModel;
  /** 备注 */
  remark: string;
  /** 删除设备提示信息 */
  removeDeviceTip: string;
  /** 安全补充措施 */
  safePatchMeasure: string;
  /** 计划停电时间 */
  scheduledCutOffTime: number;
  /** 计划供电时间 */
  scheduledSupplyTime: number;
  /** 停电申请单状态 */
  status: string;
  /** 停电申请单类型 */
  type: string;
  /** 停电申请单修改时间 */
  updateTime: number;
  /** 修改人 */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface DeviceInfoModel {
  /** 明细标识 */
  code: string;
  /** 设备图标 */
  deviceCategoryIcon: string;
  /** 设备编号 */
  deviceCode: string;
  /** 设备标识 */
  deviceId: number;
  /** 设备工艺号 + 设备名称 */
  deviceName: string;
  /** 配电柜摄像头编号 */
  distributionCabinetCameraCode: string;
  /** 配电柜摄像头标识 */
  distributionCabinetCameraId: number;
  /** 配电柜编号 */
  distributionCabinetCode: string;
  /** 配电柜标识 */
  distributionCabinetId: number;
  /** 配电室编号 */
  distributionRoomCode: string;
  /** 配电室标识 */
  distributionRoomId: number;
  /** 配电室名称 */
  distributionRoomName: string;
  /** 相关错误信息 */
  error: string;
  /** 远操异常信息 */
  errorMessage: string;
  /** 分合闸状态 */
  light: DeviceStatusLightEnum;
  /** 设备锁 */
  lockCounter: number;
  /** 全父级设备名称路径 */
  parentPathName: string;
  /** PLC检测类型 */
  plcDetectType: number;
  /** 带电类型 */
  powerType: number;
  /** 是否是主设备 */
  primary: boolean;
  /** 设备工艺号 */
  processNo: string;
  /** 明细状态 */
  status: string;
  /** 明细是否是试车 */
  testFlag: boolean;
  /** 操作票标识 */
  ticketId: number;
  /** 操作票名称 */
  ticketName: string;
}

export interface OuterAssModel {
  /** 外部关联信息标识 */
  code: string;
  /** 停送电申请单标识 */
  formCode: string;
  /** 外部关联信息名称 */
  name: string;
  /** 外部关联信息类型 */
  type: string;
}

export interface PowerCutTodayCountModel {
  /** 已完成停电申请单总数 */
  alreadyCompleteCount: number;
  /** 已确认流程结束的停送电单数 */
  alreadyConfirmCompleteCount: number;
  /** 已确认停电申请单总数 */
  alreadyConfirmCount: number;
  /** 已确认试车的停送电单数 */
  alreadyConfirmTestCount: number;
  /** 已终止停电申请单总数 */
  alreadyStopCount: number;
  /** 进行中停电申请单总数 */
  duringCount: number;
  /** 远操异常配电操作总数 */
  errorTaskCount: number;
  /** 待确认流程结束的停送电单数 */
  waitConfirmCompleteCount: number;
  /** 待确认停电申请单总数 */
  waitConfirmCount: number;
  /** 待确认试车的停送电单数 */
  waitConfirmTestCount: number;
}
