import { BasicFetchListResult } from '/@/api/model/baseModel';

/** 获取系统配置接口返回数据 */
export interface GetDevicePowerSupplyPhotoListParams {
  /** 模糊查询参数 */
  globalName?: string;
  /** 当前页码数 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
}

export interface DevicePowerSupplyPhotoExtendModel {
  /** 设备唯一编码 */
  deviceCode: string;
  /** 设备Id */
  deviceId: number;
  /** 设备名称 */
  deviceName: string;
  /** 设备工艺号 */
  deviceProcessNo: string;
  /** id */
  id: number;
  /** 照片标示码 */
  photo: string;
  /** 照片名称 */
  photoName: string;
}

export type DevicePowerSupplyPhotoCollection =
  BasicFetchListResult<DevicePowerSupplyPhotoExtendModel> & {
    deviceIds: Nullable<number[]>;
  };

export interface DevicePowerSupplyPhotoBaseModel {
  /** 设备id */
  deviceId: number;
  /** id */
  id: number;
  /** 照片标示码 */
  photo: string;
  /** 照片名称 */
  photoName: string;
}
