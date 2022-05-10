/** 停送电设备编码 */
export enum DevicePowerTypeCodesEnum {
  /** 未知类型设备 */
  UNKNOWN = -1,
  /** 普通高压设备 */
  HIGH_VOLTAGE = 1,
  /** 普通低压设备 */
  LOW_VOLTAGE = 2,
  /** 不参与停送电设备 */
  NO_VOLTAGE = 3,
  /** 非常规设备 */
  UNCONVENTIONAL_DEVICE = 4,
  /** 远程高压设备 */
  REMOTE_HIGH_VOLTAGE = 5,
  /** 远程低压设备 */
  REMOTE_LOW_VOLTAGE = 6,
  /** 远程非常规设备 */
  REMOTE_UNCONVENTIONAL_DEVICE = 7,
}

/** 停送电带电类型 */
export enum DevicePowerTypesEnum {
  /** 高压停送电 */
  HIGH_VOLTAGE = 1,
  /** 低压停送电 */
  LOW_VOLTAGE = 2,
  /** 特殊停送电 */
  SPECIAL_VOLTAGE = 3,
}

/** 申请停送电时二次确认方式 */
export enum ApplyVerificationEnum {
  /** 不需要验证 */
  NO,
  /** 人脸识别 */
  FACE,
  /** 二维码签批 */
  QRCODE,
}

/** 监护人认证方式 */
export enum GuardianVerificationEnum {
  /** 二维码签批 */
  QRCODE = 1,
  /** 人脸识别 */
  FACE = 2,
}

/** 设备分合闸状态指示灯颜色 */
export enum DeviceStatusLightEnum {
  RED = 1,
  GREEN = 2,
  PURPLE = 3,
  GRAY = 4,
  NONE = 5,
}

/** 高压停送电操作票操作类型 */
export enum HvOperationTemplateTypeEnum {
  CUT,
  SUPPLY,
}
