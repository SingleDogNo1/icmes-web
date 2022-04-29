import { TypeEnum } from './configurableObjectModel';

export interface GetPlcPointsTreeParams {
  /** 点位绝对路径 */
  uniPath: string;
}

export interface PLCPointLeavesCollection {
  item: Nullable<PLCPointTreeModel[]>;
  level: number;
}

export interface PLCPointTreeModel {
  data: string;
  /** 是否为 PLC 点 */
  point: boolean;
  uniPath: string;
}

export interface GetPlcPointsListParams {
  /** 点位编码 */
  code?: string;
  /** 配点对象名称(包含设备名称) */
  name?: string;
  /** 是否检索需要存储点位为1 的 已配信号点列表（默认不传false） */
  needStorageFlag?: boolean;
  /** 当前页码数 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
  /** 点位内容 */
  pointContent?: string;
  /** 点位类型 */
  pointType?: PointTypeEnum;
  /** 配点对象ID（包含设备ID） */
  relativeObjectId: number;
  /** 点位对象类型 */
  relativeObjectType: TypeEnum;
}

export enum PointTypeEnum {
  /** 数字量 */
  NUMBER,
  /** 模拟量 */
  SIMULATION,
  /** 控制量 */
  CONTROL,
}

export interface PLCPointBaseModel {
  /** 业务类型 */
  businessType?: string;
  /** 点位编码 */
  code?: string;
  /** 创建时间 */
  createTime?: number;
  /** 创建用户ID */
  createUserId?: number;
  /** 设备监控开启标识 */
  deviceMonitorFlag?: boolean;
  /** 数字量1含义 */
  digitalOneComment?: string;
  /** 数字量0含义 */
  digitalZeroComment?: string;
  /** 标识符 */
  id?: number;
  /** 是否需要存储 */
  needStoraged?: boolean;
  /** 监控显示顺序 */
  orderNum?: number;
  /** 点位内容 */
  pointContent?: string;
  /** 点位类型 */
  pointType?: PointTypeEnum;
  /** 额定值 */
  ratedValue?: string;
  /** 配点对象ID（包含设备ID）关联 ConfigurableObject表 */
  relativeObjectId?: number;
  /** 点位对象类型 */
  relativeObjectType?: TypeEnum;
  /** 点位绝对路径 */
  uniPath?: string;
  /** 单位 */
  unit?: string;
  /** 最后修改时间 */
  updateTime?: number;
  /** 最后修改用户 */
  updateUserId?: number;
  /** 用于高并发的数据版本控制 */
  versionTag?: string;
}

export interface PLCPointCollection {
  items: Nullable<PLCPointFullModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface PLCPointFullModel extends PLCPointBaseModel {
  ancientCode: string;
  ancientName: string;
  hasDeleted: boolean;
  name: string;
  processNo: string;
  relativeCode: string;
}

export interface UpdatePlcPointParams {
  plcPointlist: PLCPointBaseModel[];
}
