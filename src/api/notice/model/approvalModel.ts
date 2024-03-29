import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface GetApprovalListParams {
  /** 是否正序 */
  ascending?: boolean;
  /** 业务类型列表 */
  businessType?: string;
  /** 全局搜索 */
  globalName?: string;
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码 */
  pageNo: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize: number;
  status?: number[];
}

export interface ApprovalModel {
  approvalStatus: number;
  belongeUserId: number;
  businessCreateUserId: number;
  businessCreateUserName: string;
  businessData: string;
  businessKey: string;
  businessStepKey: string;
  businessType: string;
  id: number;
  updateTime: number;
}

export type GetApprovalListResultModel = BasicFetchListResult<ApprovalModel>;
