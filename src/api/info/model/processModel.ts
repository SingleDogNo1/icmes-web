export interface GetProcessListParam {
  /** 是否正序 */
  ascending?: true;
  /** 工艺系统编号 */
  code?: string;
  /** 是否构建树 */
  forTree?: boolean;
  /** 全局模糊查询字段 */
  globalName?: string;
  /** 递归的层级次数(0标识全部子孙) */
  hierarchy?: number;
  /** 工艺系统名称 */
  name?: string;
  /** 排序字段 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 每页多少条数据(0 表示不分页) */
  pageSize?: number;
  /** 父级工艺系统Id */
  parentId?: number;
}

export interface GetProcessListResultModel {
  items: Nullable<ProcessModel[]>;
  totalCount: number;
  totalPages: number;
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
