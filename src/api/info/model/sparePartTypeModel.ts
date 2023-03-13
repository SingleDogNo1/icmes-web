export interface GetSparePartTypesListParams {
  /** 是否正序 */
  ascending?: boolean;
  /** 全局模糊查询字段 */
  globalName?: string;
  /** 排序字段 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 每页多少条数据(0 表示不分页) */
  pageSize?: number;
}

export interface SparePartTypeCollection {
  items: Nullable<SparePartTypeModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface SparePartTypeModel {
  /** 编号 */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建账号标识符 */
  createUserId: number;
  /** 工艺标识符 */
  id: number;
  /** 工艺名称 */
  name: string;
  /** 更新时间 */
  updateTime: number;
  /** 更新账号标识符 */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}
