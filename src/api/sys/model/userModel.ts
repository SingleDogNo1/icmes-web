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
  /** 是否需要修改密码 */
  changePassword?: boolean;
}

export interface resetPwdParams {
  /** 旧密码 */
  confirmPassword: string;
  /** aes密钥相关 */
  key?: string;
  /** 新密码 */
  password: string;
}

export enum ContainStatus {
  /** 不可以包含 */
  CANT_BE = 0,
  /** 可以包含 */
  MAY_BE = 1,
  /** 必须包含 */
  MUST_BE = 2,
}

export interface PasswordValidationModel {
  lockedUserMessage: string;
  lockNumber: number;
  length: { min: number; max: number };
  complex: {
    number: ContainStatus;
    lowercase: ContainStatus;
    capital: ContainStatus;
    character: ContainStatus;
  };
  errorMessage: {
    excludingNumber: string;
    containNumber: string;
    excludingLowercase: string;
    containLowercase: string;
    excludingCapital: string;
    containCapital: string;
    excludingCharacter: string;
    containCharacter: string;
    lengthTips: string;
    containSpace: string;
  };
}

export interface EmployeeResultModel {
  /** 员工头像路径 */
  avatar: string;
  /** 员工出生日期 */
  birthDate: string;
  /** 员工类型 */
  category: string;
  /** 员工工号 */
  code: string;
  /** 员工信息创建时间 */
  createTime: number;
  /** 员工电子邮件地址 */
  email: string;
  /** 组织机构全名 */
  fullName: string;
  /** 组织机构全名关联的组织机构标识 */
  fullOrgIds: string;
  /** 员工性别 */
  gender: string;
  /** 员工毕业学校 */
  graduateSchool: string;
  /** 员工毕业时间 */
  graduationDate: number;
  /** 员工最高学位 */
  highDegree: string;
  /** 员工最高学历 */
  highEducation: string;
  /** 员工标识 */
  id: number;
  /** 员工身份证号码 */
  identityCard: string;
  /** 员工入职日期 */
  joinDate: number;
  /** 员工手机号码 */
  mobilePhone: string;
  /** 员工姓名 */
  name: string;
  /** 员工办公室电话 */
  officePhone: string;
  /** 员工办公室电话区号 */
  officePhoneArea: string;
  /** 员工办公室电话分机号 */
  officePhoneExt: string;
  /** 员工所属组织机构编码 */
  organizationCode: string;
  /** 员工所属组织机构ID */
  organizationId: number;
  /** 员工所属组织机构名称 */
  organizationName: string;
  /** 员工职业资格 */
  qualification: string;
  /** 员工的专用设备号 */
  specialDevice: string;
  /** 员工所学专业 */
  specialty: string;
  /** 员工信息更新时间 */
  updateTime: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
  /** 员工工种 */
  workType: string;
}

export interface AuthUserModel {
  accessToken: string;
  changePassword: boolean;
  employeeCode: string;
  employeeId: number;
  employeeName: string;
  faceFlag: boolean;
  id: number;
  organizationId: number;
  specialDevice: string;
  roles: AuthRoleOrganizationModel;
}

export interface AuthRoleOrganizationModel {
  organizationCode: string;
  organizationId: number;
  organizationName: string;
  roleCode: string;
  roleId: number;
  roleName: string;
  childOrganizations: number[];
  features: AuthFeatureModel[];
}

export interface AuthFeatureModel {
  code: string;
  id: number;
  menuId: number;
  name: string;
  resources: AuthResourceModel[];
}

export interface AuthResourceModel {
  code: string;
  name: string;
  id: number;
}
