import { ProductionBaseModel } from './basicModel';

export enum calculationFunctionEnum {
  PLC_DIFFERENCE,
  PLC_DIFFERENCE_AND_RATIO,
  PLC_DIFFERENCE_AND_RATIO_NO_SIGNAL,
  IN_WASH_REDUCE_OUTPUT,
  SLIME_NO_SIGNAL,
}

export interface ProductionListDetailSettingModel {
  calculationFunction: calculationFunctionEnum;
  id: number;
  plcPoints: string[];
  productId: number;
  productionBaseModel: ProductionBaseModel;
  ratio: number;
}

export interface ProcessModel {
  ancestorId: number;
  childIds: string;
  /** 工艺编码 */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建账号标识符 */
  createUserId: number;
  /** 工艺系统全称 */
  fullName: string;
  /** 是否有子集 */
  hasChild: boolean;
  /** 工艺标识符 */
  id: number;
  /** 工艺名称 */
  name: string;
  /** 父级工艺系统全称 */
  parentFullName: string;
  /** 工艺父项标识符 */
  parentId: number;
  /** 更新时间 */
  updateTime: number;
  /** 更新账号标识符 */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface ProductionListSettingModel {
  /** 编号 */
  code: string;
  delete: boolean;
  /** 配置详情 */
  details: Nullable<ProductionListDetailSettingModel[]>;
  /** 标识符 */
  id: number;
  /** 是否被删除 */
  isDelete: boolean;
  /** 名字 */
  name: string;
  /** 工艺系统id */
  processId: number;
  processModel: ProcessModel;
  /** 备注 */
  remark: string;
  /** 是否启用 */
  useful: boolean;
}
