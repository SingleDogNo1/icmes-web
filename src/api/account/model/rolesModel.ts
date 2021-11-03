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
export interface GetRoleListByIdResultModel {
  items: AccountRoleModel[];
  totalCount: number;
  totalPages: number;
}

export interface AccountRoleModel {
  assId: number;
  fullOrgName: string;
  organizationCode: string;
  organizationId: number;
  roleCode: string;
  roleId: number;
  roleName: string;
}

export interface GetRoleListParams {
  /** 正序倒序 */
  ascending?: true;
  /** 角色编码 */
  code?: string;
  /** 模糊查询 */
  globalName?: string;
  /** 角色编码 */
  id?: number;
  /** 角色名称 */
  name: string;
  /** 排序列名 */
  orderBy: string;
  /** 当前页数 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
}

export interface GetRoleListResultModel {
  totalCount: number;
  totalPages: number;
  items: Nullable<RoleModel[]>;
}

export interface RoleModel {
  code: string;
  id: number;
  key: string;
  name: string;
  remark: string;
  versionTag: string;
}

export interface AddRoleParams {
  /** 角色Id */
  Id: number;
  /** 角色编码 */
  code: string;
  /**权限列表 */
  features: string[];
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  remark: string;
}

export interface AddRoleResultModel {
  code: string;
}

export interface EditRoleParams {
  /** 角色Id */
  id: number;
  /** 角色编码 */
  code: string;
  /**权限列表 */
  features: string[];
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  remark: string;
  /** 版本控制 */
  versionTag: string;
}
export interface EditRoleResultModel {
  code: string;
}

export interface GetFeaturesResultModel {
  /** 功能编码 */
  code: string;
  /** 功能唯一标识符 */
  id: number;
  /** 功能所属的菜单项 */
  menuId: number;
  /** 功能名称 */
  name: string;
  /** 功能的描述 */
  remark: string;
}

export interface GetAccountOrgParams {
  roleId: number;
  orderBy: string;
  ascending: boolean;
  pageSize: number;
  pageNo: number;
}

export interface GetAccountOrgResultModel {
  totalCount: number;
  totalPages: number;
  items: Nullable<AccountOrgModel[]>;
}

export interface AccountOrgModel {
  code: string;
  fullOrgName: string;
  id: number;
  name: string;
}
