export interface BasicFetchListResult<T> {
  items: Nullable<T[]>;
  /** 数据总条数 */
  totalCount: number;
  /** 数据总页数 */
  totalPages: number;
}
