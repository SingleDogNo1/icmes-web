/* 停送电设备带电类型 */
export enum DevicePowerTypesEnum {
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
