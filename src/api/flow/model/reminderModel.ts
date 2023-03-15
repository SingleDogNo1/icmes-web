import { BasicFetchListResult } from '/@/api/model/baseModel';
import {
  workflowObjectTypeEnum,
  notificationPhaseEnum,
  reminderTypeEnum,
} from '/@/enums/workflowEnum';

export interface GetReminderListParam {
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

export interface ReminderModel {
  id: number;
  isWorkingShiftNoticeOn: boolean;
  jsonParseObjectInfo: string;
  notificationObject: string;
  notificationObjectType: workflowObjectTypeEnum;
  notificationPhase: notificationPhaseEnum;
  type: reminderTypeEnum;
  verification: Nullable<string>;
  versionTag: string;
  workflowNodeId: number;
}

export type GetReminderListResultModel = BasicFetchListResult<ReminderModel>;
