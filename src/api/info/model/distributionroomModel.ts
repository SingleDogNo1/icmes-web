export interface GetDistributionRoomListParam {
  /** 正序倒序 **/
  ascending?: boolean;
  /** 排序列名 **/
  orderBy?: string;
  /** 当前页数 **/
  pageNo?: number;
  /** 每页条数 **/
  pageSize?: number;
  /** 配电室ID **/
  roomId?: number;
}
export interface GetDistributionRoomListResult {
  items: DistributionRoomCollection[];
  totalCount: number;
  totalPages: number;
}

export interface DistributionRoomCollection {
  /** 配电室编号 **/
  code: string;
  /** 创建时间 **/
  createTime: number;
  /** 建用户ID **/
  createUserId: number;
  /** 标识 **/
  id: number;
  /** 配电室名称 **/
  name: string;
  /** 最后修改时间 **/
  updateTime: number;
  /** 最后修改用户 **/
  updateUserId: number;
  /** 用于高并发的数据版本控制 **/
  versionTag: string;
}

export interface EditDistributionRoomParam {
  /** 配电室编号 **/
  code?: string;
  /** 配电室名称 **/
  name?: string;
  /** 标识Id **/
  id?: number;
  /** 版本控制 **/
  versionTag?: string;
}

export interface EditDistributionCabinetsParam {
  /** 关联摄像头标识Id **/
  cameraId?: number;
  /** 配电柜编号 **/
  code?: string;
  /** 标识 **/
  id?: number;
  /** 配电室标识符 **/
  roomId?: number;
  /** 版本控制 **/
  versionTag?: string;
}

export interface EditDistributionEntranceGuardsParam {
  /** 位置描述 **/
  description?: string;
  /** 门禁系统ID **/
  entranceGardSystemId?: string;
  /** 标识 **/
  id?: number;
  /** 配电室标识Id **/
  roomId?: number;
}

export interface EditDistributionCabinetsDevicesParam {
  /** 设备标识 **/
  deviceIds?: number[];
  /** 标识 **/
  id?: number;
}
