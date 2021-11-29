export interface GetNoticeSettingConfigListParams {
  /** 正序倒序 **/
  ascending?: boolean;
  /** 业务类型 **/
  businessType?: string;
  /** 排序列名 **/
  orderBy?: string;
  /** 当前页数 **/
  pageNo?: number;
  /** 每页条数 **/
  pageSize?: number;
  /** 是否是工作流 **/
  workflowFlag?: boolean;
}

export interface GetNoticeSettingConfigListResultModel {
  /** 正序倒序 **/
  items: ReminderConfigModel[];
  totalCount: number;
  totalPages: number;
}

export interface ReminderConfigModel {
  businessType: string;
  messageReminder: boolean;
  mobilePush: boolean;
  notificationType: number;
  tag: string;
  versionTag: string;
  webPush: boolean;
  workflowFlag: boolean;
}
