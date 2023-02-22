export interface GetDevicesCategoryListParam {
  /** 是否正序 */
  ascending?: boolean;
  /** 查询参数 */
  globalName?: string;
  /** 是否是主设备 */
  isPrimary?: boolean;
  /** 排序列名 */
  orderBy?: string;
  /** 当前页数 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
}

/** 设备查询接口返回数据 */
export interface GetDevicesCategoryListResultModel {
  items: Nullable<DeviceCategoryModel[]>;
  totalCount: number;
  totalPages: number;
}

export interface DeviceCategoryModel {
  /** 设备类型编号 */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建的账户标识 */
  createUserId: number;
  /** 设备类型图标 */
  icon: string;
  /** 设备类型标识符 */
  id: number;
  /** 设备类型名称 */
  name: string;
  primary: boolean;
  /** 规格模版数据集合 */
  specDataList: Nullable<SpecDataModel[]>;
  /** 更新时间 */
  updateTime: number;
  /** 更新的账号标识 */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

interface SpecDataModel {
  extraDisplayMode: boolean;
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  unit: string;
}

export interface CreateDeviceCategoryParams {
  /** 设备类型编号 */
  code: string;
  /** 设备图标 */
  icon: string;
  /** 设备类型是否是主设备 */
  isPrimary: boolean;
  /** 设备类型名称 */
  name: string;
  /** 设备参数ids */
  specDataIds: number[];
}

export interface DeviceCategoryCollection {
  totalCount: number;
  totalPages: number;
  items: Nullable<DeviceCategoryModel[]>;
}

export interface UpdateDevicesCategoryParams {
  /** 图标 */
  icon: string;
  /** 设备类型名称 */
  name: string;
  /** 设备参数ids */
  specDataIds: number[];
  /** 版本号 */
  versionTag: string;
}
