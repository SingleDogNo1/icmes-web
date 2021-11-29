export interface GetNoticeListParam {
  /** 是否正序 */
  ascending?: boolean;
  /** 业务类型列表 */
  businessTypes?: string[];
  /** 全局搜索 */
  globalName?: string;
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码 */
  pageNo: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize: number;
}

export interface GetNoticeListResultModel {
  hasNotRead: boolean;
  items: Nullable<MessageModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface MessageModel {
  belongeUserId: number;
  businessCreateUserId: number;
  businessCreateUserName: string;
  businessData: businessDataModel;
  businessKey: string;
  businessType: string;
  id: number;
  readed: boolean;
  updateTime: number;
}

export interface businessDataModel {
  id: string;
  code: string;
  title: string;
  result: number;
  status: number;
  content: string;
  stepDesc: string;
  listContent: string;
  createUserId: number;
  createUserName: string;
}

export interface MarkReadResultModel {
  code: number;
}
