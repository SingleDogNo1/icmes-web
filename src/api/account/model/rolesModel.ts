/** 通过 ID 获取账号角色列表接口参数 */
export interface GetRoleListByIdParams {
  /** 正序倒序 */
  ascending: boolean;
  /** 排序列名 */
  orderBy: string;
  /** 当前页数 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
}

/** 通过 ID 获取账号角色列表接口返回数据 */
export interface GetRoleListByIdParamsResultModel {
  items: Role[];
  totalCount: number;
  totalPages: number;
}

export interface Role {
  assId: number;
  fullOrgName: string;
  organizationCode: string;
  organizationId: number;
  roleCode: string;
  roleId: number;
  roleName: string;
}
