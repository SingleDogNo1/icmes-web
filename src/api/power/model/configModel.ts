import {
  ApplyVerificationEnum,
  GuardianVerificationEnum,
  ConfigNoticeObjTypeEnum,
  ConfigErrorNoticeTypeEnum,
} from '/@/enums/powerCutEnum';

export interface PowerCutConfigModel {
  /** 申请停送电时二次确认方式 */
  applyVerification: ApplyVerificationEnum;
  /** 是否每天24:00作废审批通过但未开始停电的停送电单 */
  autoCloseForm: boolean;
  /** 监护人有效期：单位分钟 */
  guardianExpiration: number;
  /** 监护人认证方式 */
  guardianVerification: GuardianVerificationEnum;
  /** 大屏不操作后倒计时退出时间：单位分钟 */
  logoutCountdown: number;
  /** 电工配电必须选择监护人 */
  needGuardian: boolean;
  /** 电工配电必须选择操作票 */
  needTicket: boolean;
  /** 远程停电间隔（单位ms） */
  remoteCutInterval: number;
  /** 是否需要送电监护人 */
  remoteNeedGuardian: boolean;
  /** 远程送电间隔（单位ms） */
  remoteSupplyInterval: number;
  /** 安全技术措施 */
  safePatchMeasure: string;
  /** 大屏刷新时间间隔：单位分钟 */
  taskFreshInterval: number;
}

export interface UpdatePowerCutConfigParams {
  /** 要修改的配置字段 */
  name: keyof PowerCutConfigModel;
  /** 修改的结果 */
  value: any;
}

export interface ConfigReminderModel {
  /** 标识 */
  id: number;
  /** 通知对象 */
  noticeObject: string;
  /** 通知对象类型 */
  noticeObjectType: ConfigNoticeObjTypeEnum;
  /** 通知类型 */
  type: ConfigErrorNoticeTypeEnum;
  /** 是否按班次通知 */
  workingShift: boolean;
}

export interface ConfigReminderParams {
  /** 通知对象 */
  noticeObject: string;
  /** 通知对象类型 */
  noticeObjectType: ConfigNoticeObjTypeEnum;
  /** 是否按班次通知 */
  workingShift: boolean;
}
