import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface GetDictTypesParam {
  /** 是否正序 */
  ascending: boolean;
  /** 类型编号 */
  code: string;
  /** 模糊查询字符串 */
  globalName: string;
  /** 类型名称 */
  name: string;
  /** 排序字段 */
  orderBy: string;
  /** 当前页码 */
  pageNo: number;
  /** 每页条数，为 0 不分页 */
  pageSize: number;
}

export interface GetDictTypesResultModel {
  items: DictTypeModel[];
  /** 总条数 */
  totalCount: number;
  /** 总页数 */
  totalPages: number;
}

export interface DictTypeModel {
  /** 字典类型code */
  code: string;
  /** 创建时间 */
  createTime: number;
  /** 创建人userId */
  createUserId: number;
  isBuiltIn: string;
  lastUpdateTime: number;
  lastUpdateUserId: number;
  /** 字典类型名称 */
  name: string;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface AddDictTypeParam {
  code: string;
  name: string;
}

export interface AddDictTypeResultModel {
  code: number;
}

export interface EditDictTypeParam extends AddDictTypeParam {
  versionTag?: string;
}

export interface EditDictTypeResultModel {
  code: number;
}

export interface GetDictDataParam {
  /** 是否正序 */
  ascending?: boolean;
  /** 编号集合 */
  codeList?: string[];
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码数 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
  /** 类型编号 */
  typeCode?: string;
}

export interface DictDataModel {
  /** 字典编码 */
  code: string;
  createTime: string;
  createUserId: string;
  /** 是否启用 */
  disabled: boolean;
  /** 更新时间 */
  lastUpdateTime: number;
  /** 更新人UserId */
  lastUpdateUserId: number;
  /** 字典名称 */
  name: string;
  /** 排序 */
  order: string;
  /** 字典类型编码 */
  typeCode: string;
  /** 更新人 */
  updateUserName: string;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export type GetDictDataResultModel = BasicFetchListResult<DictDataModel>;

export interface AddDictDataParam {
  /** 字典编码 */
  code?: string;
  /** 字典名称 */
  name?: string;
  /** 排序 */
  order?: number;
  /** 字典类型 */
  typeCode?: string;
}

export interface UpdateDictDataParam {
  /** 字典名称 */
  name?: string;
  /** 排序 */
  order?: number;
  /** 字典类型 */
  typeCode?: string;
  /** 控制版本 */
  versionTag?: string;
}

export interface DisabledDictDataParam {
  /** 控制版本 */
  versionTag?: string;
}
export interface EnabledDictDataParam {
  /** 控制版本 */
  versionTag?: string;
}
