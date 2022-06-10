import { workflowObjectTypeEnum } from '/@/enums/workflowEnum';

export interface GetReportingListParam {
  /** 是否正序 */
  ascending?: boolean;
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 每页多少条记录 0表示不分页 */
  pageSize?: number;
  workflowNodeId: number;
}

export interface GetReportingListResultModel {
  items: Nullable<ReportingModel[]>;
  /** 数据总条数 */
  totalCount: number;
  /** 数据总页数 */
  totalPages: number;
}

export interface ReportingModel {
  createTime: number;
  createUserId: number;
  id: number;
  isWorkingShiftNoticeOn: boolean;
  jsonParseObjectInfo: string;
  reportingObject: string;
  reportingObjectType: workflowObjectTypeEnum;
  timeoutPeriod: number;
  updateTime: number;
  updateUserId: number;
  verification: Nullable<string>;
  versionTag: string;
  workflowNodeId: number;
}
