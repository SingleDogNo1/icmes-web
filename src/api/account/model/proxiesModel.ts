export interface addProxyParam {
  assignUserId: number;
  consignUserRoleAss: number;
  periodDays: string;
  proxyEndDate: string;
  proxyStartDate: string;
}

export interface EditProxyResultModel {
  code: string | number;
}

export interface GetProxyResultModel {
  /** 指派人employeeCode */
  assignEmployeeCode: string;
  /** 指派人employeeId */
  assignEmployeeId: number;
  /** 指派人Id */
  assignUserId: number;
  /** 指派的代理账号及角色关系流水号 */
  consignUserRoleAss: number;
  /** 代理周期 */
  cycle: string;
  /** 代理结束时间 */
  endTime: number;
  /** 代理Id */
  id: number;
  /** 接手人 */
  name: string;
  /** 组织机构 */
  organizationName: string;
  /** 角色 */
  roleName: string;
  /** 代理开始时间 */
  startTime: number;
  /** 版本标签 */
  versionTag: string;
}

export interface EditProxyParam extends addProxyParam {
  versionTag: string;
}
