/* 获取公钥接口返回数据 */
export interface PublicKeyModel {
  codeList: string[];
  key: string;
}

/* 登录接口请求参数 */
export interface LoginParams {
  /** 员工工号 */
  employeeCode: string;
  /** 登录密码 */
  password: string;
  /** 登录私钥 */
  key?: string;
}

/** 登录接口返回数据 */
export interface LoginResultModel {
  /** 登录权限验证token */
  accessToken: string;
  /** 员工头像路径 */
  avatar: string;
  /** 表示账号是否需要更改密码 */
  changePassword: boolean;
  /** 员工编号 */
  employeeCode: string;
  /** 员工标识Id */
  employeeId: number;
  /** 功能范围 map */
  featureScopes: { [index: string]: number[] };
  /** 功能映射 map */
  features: { [index: string]: { [index: string]: boolean } };
  /** 是否有脸部信息 */
  hasFaceInfo: boolean;
  /** 员工姓名 */
  name: string;
  /** 员工所属部门 */
  organization: string;
  /** 员工所属部门标识 */
  organizationId: number;
  /** 专用设备号 */
  specialDevice: string;
  /** 登录用户Id */
  userId: number;
}

/* 用户信息返回数据 */
export interface GetUserInfoModel {
  /** 用户id */
  userId: number;
  /** 用户名 */
  name: string;
  /** 员工标识Id */
  employeeId: number;
  /** 员工所属部门标识 */
  organizationId: number;
  /** 头像 */
  avatar: string;
}
