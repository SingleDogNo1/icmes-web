import { HvOperationTemplateTypeEnum } from '/@/enums/powerCutEnum';

export interface GetHvOperationParams {
  /** 正序倒序 */
  ascending: boolean;
  /** 手机端根据设备id检索列表 */
  deviceId?: number;
  /** web端根据设备及附属设备id集合 */
  deviceIds?: number[];
  /** 模糊查询参数 */
  globalName?: string;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码数 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
}

export interface HvOperateTemplateAdvanceModel {
  /** 高压模板设备 */
  devices: Nullable<HvOperationTemplateDeviceModel[]>;
  /** 启用禁用标识符 */
  flag: boolean;
  /** 操作票标志 */
  id: number;
  /** 操作票名称 */
  name: string;
  /** 操作票编号 */
  number: string;
  /** 高压模板步骤 */
  steps: HvOperationTemplateStepModel[];
}

export interface HvOperationTemplateDeviceModel {
  /** 设备唯一标识符 */
  deviceCode: string;
  /** 设备标识符 */
  deviceId: number;
  /** 设备名称 */
  deviceName: string;
  /** 设备工艺号 */
  processNo: string;
}

export interface HvOperationTemplateStepModel {
  /** 高压操作票模板标识符 */
  hvOperationId: number;
  /** 步骤标识符 */
  id: number;
  /** 序号 */
  order: number;
  /** 步骤 */
  step: string;
  /** 操作类型 */
  type: HvOperationTemplateTypeEnum;
}

export interface GetHvOperationTemplateResultModel {
  items: Nullable<HvOperateTemplateAdvanceModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface ToggleHvOperationTemplateParams {
  /** 高压票状态 */
  flag: boolean;
  /** 高压票标识符 */
  id: number;
}

export interface UpdateHvOperationParams {
  /** 高压票模板名称 */
  name: string;
  /** 高压票模板编号 */
  number: string;
}

export interface UpdateHvOperationDevicesParams {
  deviceIds: number[];
}

export interface UpdateHvOperationTemplateStepParams {
  steps: UpdateHvOperationStep[];
}

export interface UpdateHvOperationStep {
  /** 步骤标识符 */
  id?: Nullable<number>;
  /** 序号 */
  order: number;
  /** 步骤详细 */
  step: string;
  /** 类型 */
  type: HvOperationTemplateTypeEnum;
}
