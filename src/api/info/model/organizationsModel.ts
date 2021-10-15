export interface AccountTreeParams {
  /** 正序倒序 */
  ascending?: boolean;
  /** 从当前组织机构下查询多少层组织和人 */
  hierarchy?: number;
  /** 权限查询条件集合 */
  includedFeatures?: string[];
  /** 员工姓名 */
  name?: string;
  /** 排序列名 */
  orderBy?: string;
  /** 当前页 */
  pageNo?: 0;
  /** 每页条数 */
  pageSize?: 0;
  /** 父级组织机构 id */
  parentId?: number;
  /** 是否查询全部员工 */
  searchAllEmployee?: boolean;
}

export interface AccountTreeResultModel {
  items: OrganizationEmployeeAllTreeModel[];
}

export interface OrganizationEmployeeAllTreeModel {
  /** 组织机构及其下属机构员工数量 */
  childNum: number;
  /** code */
  code: string;
  /** 组织机构全称 */
  fullOrgName: string;
  /** 是否有子集 */
  hasChild: boolean;
  /** ID */
  id: string;
  /** 是否员工 */
  isEmployee: boolean;
  /** name */
  name: string;
  /** 父级ID */
  parentId: string;
  /** 所有父类的ID集合 */
  parentIdColl: string[];
  /** 真实的员工ID */
  realEmployeeId: number;
  /** 真实的组织机构ID */
  realOrgId: number;
  /** userId */
  userId: number;
}

export interface OrganizationsListParams {
  /** 是否正序 */
  ascending?: boolean;
  /** 厂商编号 */
  code?: string;
  /** 全局搜索 */
  globalName?: string;
  /** 厂商名称 */
  name?: string;
  /** 排序字段 */
  orderBy?: string;
  /** 当前页码 */
  pageNo?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 厂商类型 */
  type?: string;
}

export interface OrganizationsListResultModel {
  /** 数据总页数 */
  totalPages: number;
  /** 数据总条数 */
  totalCount: number;
  items: OrganizationsFullNameModel[];
}

export interface OrganizationsFullNameModel {
  /** 组织机构code */
  code: string;
  /** 组织机构全称 */
  fullName: string;
  /** 是否有子集 */
  hasChild: boolean;
  /** 组织机构ID */
  id: number;
  /** 组织机构名称 */
  name: string;
  /** 父级机构全称 */
  parentFullName: string;
  /** 父级机构ID */
  parentId: number;
  /** 电话 */
  phone: string;
  /** 版本标志 */
  versionTag: string;
}
