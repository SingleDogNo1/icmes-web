export interface GetTaskListParams {
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

export interface GetTaskListResultModel {
  totalCount: number;
  totalPages: number;
  items: Nullable<TaskModel[]>;
}

export interface TaskModel {
  belongeUserId: number;
  businessCreateUserId: number;
  businessCreateUserName: string;
  businessData: string;
  businessKey: string;
  businessStepKey: string;
  businessType: string;
  id: number;
  taskStatus: number;
  updateTime: number;
}
