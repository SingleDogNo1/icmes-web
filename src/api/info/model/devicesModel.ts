import { BasicFetchListResult } from '/@/api/model/baseModel';
import { DevicePowerTypeCodesEnum } from '/@/enums/powerCutEnum';
import { EmployeeResultModel } from '/@/api/sys/model/userModel';

/** 设备查询接口请求数据 */
export interface GetDevicesListParam {
  /** 是否正序 */
  ascending?: boolean;
  /** 设别标识符集合 */
  category?: string[];
  /** 设别ID集合 */
  deviceIds?: string[];
  /** 停送电设备带电类型集合 */
  devicePowerTypes?: DevicePowerTypeCodesEnum[];
  /** 设备种类列表 */
  deviceTypeList?: string[];
  /** 模糊查询条件,传processNO,code,name,model,standard拼接的字符串 */
  globalCondition?: string;
  /** 全局搜索 */
  globalName?: string;
  /** 是否返回子集 default:true */
  hasChildFlag?: boolean;
  /** 迭代层级数，全集为0 */
  hierarchy?: number;
  /** 是否为主设备，1主设备，0附属设备，不传或传空为两者全要 */
  isPrimary?: boolean;
  /** 是否按照设备类型分类返回一棵假树 */
  isTreeForDeviceCategory?: boolean;
  /** 是否按工艺系统分类返回一棵假树 */
  isTreeForProcessId?: boolean;
  /** 位置标识符列表 */
  location?: string | number[];
  /** 排序的字段名 */
  orderBy?: string;
  /** 权限组织id集合 */
  organizationIds?: number[];
  /** 当前页码 */
  pageNo?: number;
  /** 一页多少条记录 0表示不分页全部显示 */
  pageSize?: number;
  /** 所属父级设备标识符，为-1或者小于-1或者空时，为查询主设备 */
  parentId?: number;
  /** 工艺系统标识集合 */
  processIds?: number[];
  /** 关联设备对应主设备ID */
  relativeDeviceMainId?: number;
  /** 搜索关联设备-默认为false，在下拉搜索框查询中用到 */
  searchRelative?: boolean;
  /** 是否查询关联设备-默认为false，更多查询用到 */
  searchRelativeDeviceFlag?: boolean;
  /** 是否搜索所有带电设备(true:搜索所有DevicePowerType为高压或者低压的设备；其他情况搜索所有) */
  searchWithDevicePowerType?: boolean;
  /** 设备状态集合 */
  status?: string[];
}

export interface DeviceModel {
  /** 更新的附属设备标识组 */
  ancillaryDevices: Nullable<DeviceBaseModel[]>;
  /** 附属设备数量 */
  appurtenanceCount: 0;
  /** 更新的摄像头标识组 */
  cameras: Nullable<DeviceCameraModel[]>;
  /** 设备编码 */
  categoryCode: string;
  /** 备类型图标 */
  categoryIcon: Nullable<string>;
  /** 设备标识符 */
  categoryId: number;
  /** 设备类型名称 */
  categoryName: string;
  /** 按照设备类型创造假树的标识符–仅查询假树时有效 */
  categoryTreeId: string;
  /** 按照设备类型创造假树的父节点标识符–仅查询假树时有效 */
  categoryTreeParentId: string;
  /** 设备编号 */
  code: string;
  /** 创建时间 */
  createTime: Nullable<number>;
  /** 创建的账户标识 */
  createUserId: number;
  /** 设备种类 */
  deviceType: string;
  /** 更新的承包员工标识组 */
  employees: Nullable<EmployeeResultModel[]>;
  /** 全父级id */
  fullParentIds: string;
  /** 设备id */
  id: number;
  /** 设备类型 */
  isPrimary: boolean;
  /** 位置编码 */
  locationCode: string;
  /** 位置全名 */
  locationFullName: string;
  /** 位置id */
  locationId: number;
  /** 当前位置名称 */
  locationName: string;
  /** 置父级的路径 */
  locationParentName: string;
  /** 主设备organizationId */
  mainDeviceOrganizationId: number;
  /** 制造商id */
  manufacturerId: number;
  /** 制造商名称 */
  manufacturerName: string;
  /** 出厂时间 */
  manufacturingDate: number;
  /** 出厂编号 */
  manufacturingNo: string;
  /** 制造产地 */
  manufacturingPlace: string;
  /** 是否是检索匹配的数据记录 1：匹配 */
  matched: number;
  /** 备注 */
  memo: string;
  /** 型号 */
  model: string;
  /** 设备名称 */
  name: string;
  /** 组织全名 */
  organizationFullName: string;
  /**  组织id */
  organizationId: number;
  /** 所属设备标识符 */
  parentId: -1;
  /** 所属设备名称 */
  parentName: string;
  /** 照片列表 */
  photoList: Nullable<
    {
      deviceId: number;
      order: number;
      photo: string;
    }[]
  >;
  /** 更新的停送电相关标识组 */
  powerCutRelativeDevices: DeviceBaseModel[];
  /** 设备带电类型 */
  powerType: string;
  /** 主设备名称 */
  primaryName: string;
  /** 设备工艺id */
  processId: number;
  /** 设备工艺名称 */
  processName: string;
  /** 设备工艺号 */
  processNo: string;
  /** 工艺类型设备假树标识-查询工艺系统设备假树 */
  processTreeId: string;
  /** 工艺类型设备父节点假树标识-查询工艺系统设备假树 */
  processTreeParentId: string;
  /** 购买日期 */
  purchaseDate: number;
  /** 购买价格 */
  purchasePrice: number;
  qrcod: string;
  /** 使用年限 */
  serviceLife: number;
  /** 安装日期 */
  setupDate: number;
  /** 规格全称（平铺） */
  specDataFullName: string;
  /** 型号 */
  specDataList: Nullable<DeviceSpecDataModel[]>;
  /** 设备状态 */
  status: string;
  /** 更新时间 */
  updateTime: number;
  /** 更新的账户标识 */
  updateUserId: number;
  /** 供应商id */
  vendorId: number;
  /** 供应商名称 */
  vendorName: string;
  /** 版本控制 */
  versionTag: string;
}

export type GetDevicesListResultModel = BasicFetchListResult<DeviceModel>;

export interface DeviceBaseModel {
  code: string;
  createTime: number;
  createUserId: number;
  deviceCategoryIcon: string;
  deviceCategoryId: number;
  distributionCabinetCameraCode: string;
  distributionCabinetCameraId: number;
  distributionCabinetCode: string;
  distributionCabinetId: number;
  distributionRoomCode: string;
  distributionRoomId: number;
  id: number;
  isPrimary: boolean;
  locationId: number;
  manufacturerId: number;
  manufacturingDate: number;
  manufacturingPlace: string;
  memo: string;
  model: string;
  name: string;
  organizationId: number;
  parentId: number;
  parentOrgIds: string;
  parentPathName: string;
  processId: number;
  processName: string;
  processNo: string;
  purchaseDate: number;
  purchasePrice: number;
  qrcode: string;
  setupDate: number;
  status: string;
  updateTime: number;
  updateUserId: number;
  vendorId: number;
  versionTag: string;
}

export interface DeviceCameraModel {
  id: number;
  location: string;
  name: string;
}

export interface DeviceSpecDataModel {
  /** 设备 ID */
  deviceId: number;
  extraDisplayMode: boolean;
  /** 规格名 */
  name: string;
  /** 设备规格数据 ID */
  specDataId: number;
  /** 单位 */
  unit: string;
  /** 值 */
  value: string;
}

/** 设备带电类型设备查询接口请求数据 */
export interface GetDevicesPowerListParam {
  /** 是否正序 */
  ascending?: boolean;
  /** 设别标识符集合 */
  category?: Nullable<string[]>;
  /** 全局搜索（设备类型名称、设备名称（包含附属设备）、设备编号、工艺号）*/
  globalName?: string;
  /** 迭代层级数，全集为0 */
  // hierarchy?: number;
  /** 是否是当前组织id */
  // isCurrentOrganizationIds?: boolean;
  /** 是否为主设备，1主设备，0附属设备，不传或传空为两者全要 */
  // isPrimary?: boolean | null;
  /** 是否按照设备类型分类返回一棵假树 */
  needTree?: boolean;
  /** 排序的字段名 */
  orderBy?: string;
  /** 权限组织id集合 */
  organizationIds?: number[];
  /** 当前页码 */
  pageNo?: number;
  /** 一页多少条记录 0表示不分页全部显示 */
  pageSize?: number;
  /** 所属父级设备标识符，为-1或者小于-1或者空时，为查询主设备 */
  parentId?: Nullable<number>;
}
export interface GetPowerCutDevicesListParam {
  /** 是否正序 */
  ascending?: boolean;
  category?: number[];
  /** 全局搜索(设备类型名称、设备名称(包含附属设备、设备编号、工艺号) */
  globalName?: string;
  /** 是否按照设备类型分类返回一棵假树 */
  needTree?: boolean;
  /** 排序的字段名 */
  orderBy?: string;
  /** 权限组织id集合 */
  organizationIds?: number[];
  /** 当前页码 */
  pageNo?: number;
  /** 一页多少条记录(0标识不分页全部显示) */
  pageSize: number;
  /** 所属父级设备标识符，为-1或者小于-1或者空时，为查询主设备 */
  parentId?: number;
  /** 优先排序所需的父级设备标识符(关联设备) */
  parentIdsOrderBy?: number[];
  /** PLC检测类型(单选) */
  plcDetectType?: number;
  /** PLC检测类型(多选) */
  plcDetectTypes?: number[];
  /** 带电类型(单选) */
  powerType?: number;
  /** 带电类型(多选) */
  powerTypes?: number[];
  /** 此参数用于仅返回该设备ID下的所有关联设备 */
  relativeDeviceIds?: number[];
}

/** 设备带电类型设备查询接口返回数据 */
export interface GetDevicesPowerListResultModel {
  /** 已关联设备 */
  associatedDevices: number[];
  items: DevicePowerModel[];
}

export interface DevicePowerModel {
  /** 附属设备数量 */
  appurtenanceCount?: number;
  /** 设备编码 */
  categoryCode?: string;
  /** 设备标识符 */
  categoryId?: number;
  /** 设备类型名称 */
  categoryName?: string;
  /** 按照设备类型创造假树的标识符–仅查询假树时有效 */
  categoryTreeId?: string;
  /** 按照设备类型创造假树的父节点标识符–仅查询假树时有效 */
  categoryTreeParentId?: string;
  /** 设备编号 */
  code?: string;
  /** 全父级id */
  fullParentIds?: string;
  /** 设备id */
  id?: number;
  /** 设备类型 */
  isPrimary?: string;
  /** 是否是检索匹配的数据记录 1：匹配 */
  matched?: number;
  /** 设备名称 */
  name?: string;
  /** 组织id */
  organizationId?: number;
  /** 父设备标识符 */
  parentId?: number;
  /** PLC检测类型 */
  plcDetectType?: number;
  /** 带电类型 */
  powerType?: number;
  /** 主设备唯一编码 */
  primaryCode?: string;
  /** 主设备ID */
  primaryId?: number;
  /** 主设备名称 */
  primaryName?: string;
}

export interface PowerCutDeviceModel {
  /** 附属设备数量 */
  appurtenanceCount: number;
  /** 设备编码 */
  categoryCode: string;
  /** 设备标识符 */
  categoryId: number;
  /** 设备类型名称 */
  categoryName: string;
  /** 按照设备类型创造假树的标识符–仅查询假树时有效 */
  categoryTreeId: string;
  /** 按照设备类型创造假树的父节点标识符–仅查询假树时有效 */
  categoryTreeParentId: string;
  /** 设备编号 */
  code: string;
  /** 全父级id */
  fullParentIds: string;
  /** 设备id */
  id: number;
  /** 设备类型 */
  isPrimary: boolean;
  /** 是否是检索匹配的数据记录 1：匹配 */
  matched: number;
  /** 设备名称 */
  name: string;
  /** 组织 ID */
  organizationId: number;
  /** 父设备 ID */
  parentId: number;
  /** PLC 检测类型 */
  plcDetectType: number;
  /** 带电类型 */
  powerType: number;
  /** 主设备唯一编码 */
  primaryCode: string;
  /** 主设备 ID */
  primaryId: number;
  /** 主设备名称 */
  primaryName: string;
  /** 主设备工艺号 */
  primaryProcessNo: string;
  /** 设备工艺号 */
  processNo: string;
  /** 设备状态 */
  status: string;
}

export type GetPowerCutDevicesListResultModel = BasicFetchListResult<PowerCutDeviceModel> & {
  associatedDevices: Nullable<number[]>;
};

export interface BatchUpdatePowerConfigParam {
  /** 设备ids */
  deviceIds?: number[];
  /** PLC检测类型 */
  plcDetectType?: number;
  /** 带电类型 */
  powerType?: number;
}

export interface GetMoreCriterionDevicesParams {
  /** 设备种类列表 */
  deviceTypeList?: string[];
  /** 模糊查询条件,传processNO,code,name,model,standard拼接的字符串 */
  globalCondition?: string;
  /** 全局搜索字符 */
  globalName?: string;
  /** 位置标识符列表 */
  location?: number[];
  /** 位置标识符列表 */
  manufacturerIds?: number[];
  /** 出厂结束日期 */
  manufacturingDateEnd?: number;
  /** 出厂开始日期 */
  manufacturingDateStart?: number;
  /** 权限部门标识符集合 */
  organizationIds?: number[];
  /** 当前页码 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
  /** 主设备标识 */
  primaryFlag?: boolean;
  /** 工艺系统标识 */
  processIds?: number[];
  /** 投运结束日期 */
  setupDateEnd?: number;
  /** 投运开始日期 */
  setupDateStart?: number;
  /** 设备状态 */
  status?: string[];
}

export type DeviceCollection = BasicFetchListResult<DeviceModel> & {
  /** 设备规格列表 */
  specModList: Nullable<DeviceSpecDataModel[]>;
};

export interface GetCamerasListParam {
  /** 是否正序 */
  ascending: boolean;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码数 */
  pageNo: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize: number;
}

export interface CameraModel {
  /** PC端的主摄像头流地址 */
  addrMainPc: string;
  /** 手机端的主摄像头流地址 */
  addrMainPhone: string;
  /** PC端的子摄像头流地址 */
  addrSubPc: string;
  /** 手机端的子摄像头流地址 */
  addrSubPhone: string;
  /** 摄像头名称 */
  cameraName: string;
  /** 摄像头编码 */
  code: string;
  /** 标识符 */
  id: number;
  /** 摄像头位置 */
  location: string;
}

export type GetCamerasListResultModel = BasicFetchListResult<CameraModel>;
