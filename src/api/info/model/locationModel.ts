export interface GetLocationListResultModel {
  items: Nullable<LocationFullNameModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface LocationModel {
  /** 位置编码 */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建账号标识符 */
  createUserId: number;
  /** 工艺标识符 */
  id: number;
  /** 位置名称 */
  name: string;
  /** 父级全称 */
  parentFullName: string;
  /** 父项标识符 */
  parentId: number;
  /** 更新时间 */
  updateTime: number;
  /** 更新账号标识符 */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface LocationFullNameModel {
  /** 位置信息编码 */
  code: string;
  /** 位置信息全称 */
  fullName: string;
  /** 是否有子集 */
  hasChild: boolean;
  /** 位置信息ID */
  id: number;
  /** 位置信息名称 */
  name: string;
  /** 父级位置信息编码 */
  parentCode: string;
  /** 父级位置信息全称 */
  parentFullName: string;
  /** 父级位置信息ID */
  parentId: number;
  /** 版本标志 */
  versionTag: string;
}
