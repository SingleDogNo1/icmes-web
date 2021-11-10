export interface PermissionResultModel {
  featureScopes: any;
  features: any;
}

export interface GetAccountListParams {
  /** 正序倒序 */
  ascending: boolean;
  /** 员工工号 */
  code?: string;
  /** 模糊查询 */
  globalName: string;
  /** 员工名称 */
  name?: string;
  /** 排序列名 */
  orderBy: string;
  /** 当前页数 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
  /** 专用设备号 */
  specialDevice?: string;
}

export interface GetAccountListModel {
  items: Nullable<AccountModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface AccountModel {
  /** 员工工号Code */
  employeeCode: string;
  /** 员工标识Id */
  employeeId: number;
  /** 登录账号流水号 */
  id: number;
  /** 账号是否被锁定 */
  locked: boolean;
  /** 员工姓名 */
  name: string;
  /** 组织机构ID */
  organizationId: number;
  /** 账号登录密码 */
  password: string;
  /** 表示账号被错误登录的次数 */
  retryCount: number;
  /** salt */
  salt: string;
  /** 专用设备号 */
  specialDevice: string;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface EditAccountParams {
  /** 员工工号 */
  code: string;
  /** 员工姓名 */
  name: string;
  /** 员工ID */
  id?: string | number;
  /** 专用设备号 */
  specialDevice: string;
}
export interface EditAccountResultModel {
  code: string | number;
}

export interface EmployeeBaseModel {
  /** 员工工号Code */
  employeeCode: string;
  /** 员工标识Id */
  employeeId: number;
  /** 员工姓名 */
  employeeName: string;
  /** 当前员工是否有账号 */
  hasAccount: boolean;
  /** 专用设备号 */
  specialDevice: string;
}

export interface DistributionRoleParams {
  orgId: number;
  roleId: number;
}

export interface FeatureModel {
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
