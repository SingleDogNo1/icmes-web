export interface GetStrategyListParams {
  /** 正序倒序 */
  ascending?: boolean;
  /** 业务类型 */
  businessType?: string;
  /** 模糊查询参数（名称或编号） */
  nameOrNumber: string;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码数 */
  pageNo: number;
  /** 一页多少条记录, 0表示不分页全部显示 */
  pageSize: number;
}

export interface GetStrategyListResultModel {
  totalPages: number;
  totalCount: number;
  items: Nullable<StrategyModel[]>;
}

export interface StrategyModel {
  /** 业务类型 */
  businessType: string;
  /** 创建时间 */
  createTime: string;
  /** 创建者编号 */
  createUserId: number;
  /** 数据类型 */
  dataType: StrategyDataTypeEnum;
  /** 标识符 */
  id: number;
  /** 是否启用 */
  isUse: boolean;
  /** 策略名称 */
  name: string;
  /** 策略编号 */
  number: string;
  /** 描述 */
  remark: string;
  /** 更新时间 */
  updateTime: string;
  /** 更新者编号 */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export enum StrategyDataTypeEnum {
  NUMBER = 'NUMBER',
}

export enum StrategyRuleOperatorEnum {
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  EQUAL = 'EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
}

export interface StrategyRuleModel {
  createTime: string;
  createUserId: number;
  data: string;
  id: number;
  operator: StrategyRuleOperatorEnum;
  serialNumber: number;
  strategyId: number;
  updateTime: string;
  updateUserId: number;
  versionTag: string;
}

export interface UpdateStrategyRulesParams {
  /** 策略规则集合 */
  models: StrategyRuleModel[];
  /** 策略 ID */
  strategyId: number;
}

export interface EditStrategyParams {
  businessType: string;
  createUserId: number;
  dataType: StrategyDataTypeEnum;
  isUse: boolean;
  name: string;
  number: string;
  remark: string;
  id?: number;
  createTime?: string;
  updateTime?: string;
  updateUserId?: number;
  versionTag?: string;
}

export interface UpdateStrategyResultModel {
  code: number | string;
}
