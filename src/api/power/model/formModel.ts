import { PowerCutFormFullModel } from './basicModel';

export interface GetPowerCutFormListParams {
  /** 正序倒序 */
  ascending: boolean;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码数 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
  /** 是否包含高压设备 */
  containsHvDevice?: boolean;
  /** 搜索计划停电结束时间(要搜索日期零点的毫秒值) */
  cutEndTime?: number;
  /** 搜索计划停电开始时间(要搜索日期零点的毫秒值) */
  cutStartTime?: number;
  /** 模糊查询参数 */
  globalName?: string;
  /** 组织机构标识符集合 */
  organizationId?: number[];
  /** 停电申请单状态 */
  status?: string;
  /** 查询当日停电申请单使用情况（当前属性生效时，其他查询参数不生效） */
  todayStatus?: string;
  /** 停送电类型 */
  type?: string;
}

export interface GetPowerCutFormListResultModel {
  items: Nullable<PowerCutFormFullModel[]>;
  totalCount: number;
  totalPages: number;
}
