import { VendorModel } from './vendorModel';

export interface SparePartModel {
  /** 编号 */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建人ID */
  createUserId: number;
  /** 用途描述 */
  descOfUse: string;
  /** 标识符 */
  id: number;
  /** 详细位置描述 */
  locationDesc: string;
  /** 位置信息ID（关联位置表） */
  locationId: number;
  /** 备品型号 */
  model: string;
  /** 名称 */
  name: string;
  /** 排序编号 */
  orderNum: number;
  /** 备件类型ID（关联 备件类型表） */
  sparePartTypeId: number;
  /** 备件类型名称（关联 备件类型表） */
  sparePartTypeName: string;
  /** 备品规格 */
  spec: string;
  /** 库存预警 */
  stockEarlyWarning: number;
  /** 实际库存数量 */
  stockNum: number;
  /** 来自业务字典（单位） */
  unit: string;
  /** 修改时间 */
  updateTime: number;
  /** 修改人 */
  updateUserId: number;
  /** 生产厂家Id（关联厂商表） */
  vendorIds: number[];
  /** 生产厂家（关联厂商表） */
  vendorModels: VendorModel[];
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export enum SwitchStatusEnum {
  OFF,
  ON,
}

export interface SparePartHistorySettingModel {
  /** 标识符 */
  id: number;
  /** 锁定天数 */
  lockDays: number;
  /** 推送人 */
  pushEmployeeList: {
    /** 推送人 ID */
    employeeId: number;
    /** 推送人姓名 */
    employeeName: string;
  }[];
  /** 推送时间 */
  pushTime: number;
  /** 推送通知开关 */
  switchStatus: SwitchStatusEnum;
}
