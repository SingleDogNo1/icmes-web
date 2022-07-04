import { DevicePowerTypeCodesEnum } from '/@/enums/powerCutEnum';
// 停送电设备类型分组

/** 低压停送电类型 */
export const lowVoltageDeviceTypes = [
  DevicePowerTypeCodesEnum.LOW_VOLTAGE,
  DevicePowerTypeCodesEnum.REMOTE_LOW_VOLTAGE,
];

/** 高压停送电类型 */
export const highVoltageDeviceTypes = [
  DevicePowerTypeCodesEnum.HIGH_VOLTAGE,
  DevicePowerTypeCodesEnum.REMOTE_HIGH_VOLTAGE,
];

/** 远程停送电类型 */
export const remoteDeviceTypes = [
  DevicePowerTypeCodesEnum.REMOTE_HIGH_VOLTAGE,
  DevicePowerTypeCodesEnum.REMOTE_LOW_VOLTAGE,
  DevicePowerTypeCodesEnum.REMOTE_UNCONVENTIONAL_DEVICE,
];

/** 特殊(非常规)停送电 */
export const specialDeviceTypes = [
  DevicePowerTypeCodesEnum.UNCONVENTIONAL_DEVICE,
  DevicePowerTypeCodesEnum.REMOTE_UNCONVENTIONAL_DEVICE,
];
