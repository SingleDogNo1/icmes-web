import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface GetConfigurableObjectsListParam {
  /** 是否正序 */
  ascending: true;
  /** 全局模糊查询字段 */
  globalName: string;
  /** 排序字段 */
  orderBy: string;
  /** 当前页码 */
  pageNo: number;
  /** 每页多少条数据(0 表示不分页) */
  pageSize: number;
}

export interface ConfigurableObjectModel {
  /** 编号 */
  code: string;
  /** 创建时间 */
  createTime?: number;
  /** 创建用户ID */
  createUserId?: number;
  /** 标识符 */
  id?: number;
  /** 位置全称 */
  locationFullName: string;
  /** 位置id */
  locationId: number;
  /** 备注 */
  memo: string;
  /** 型号 */
  model: string;
  /** 名称 */
  name: string;
  /** 所属机构 */
  organizationFullName: string;
  /** 所属机构 ID */
  organizationId: number;
  /** 工艺系统 ID */
  processId: number;
  /** 工艺系统 */
  processName: string;
  /** 工艺号 */
  processNo: string;
  /** 最后修改时间 */
  updateTime?: number;
  /** 最后修改用户 */
  updateUserId?: number;
  /** 用于高并发的数据版本控制 */
  versionTag?: string;
}

export interface ConfigurableObjectFullModel extends ConfigurableObjectModel {
  /** 数据类型 */
  type: TypeEnum;
  /** 伪唯一标识符(C+Id: 配点对象; D+Id: 设备) */
  unionId: string;
}

export type GetConfigurableObjectsListResultModel =
  BasicFetchListResult<ConfigurableObjectFullModel>;

export enum TypeEnum {
  /** 配点对象 */
  CONFIGURE_OBJECT = 1,
  /** 设备 */
  DEVICE = 2,
}

export interface EditConfigurableObjectResultModel {
  code: number | string;
}
