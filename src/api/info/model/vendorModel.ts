import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface GetVendorsListParams {
  /** 正序倒序 */
  ascending?: boolean;
  /** 厂商编号 */
  code?: string;
  /** 全局搜索 */
  globalName: string;
  /** 厂商名称 */
  name?: string;
  /** 排序的字段名 */
  orderBy: string;
  /** 当前页码数 */
  pageNo: number;
  /** 一页多少条记录, 0表示不分页全部显示 */
  pageSize: number;
  /** 厂商类型 */
  type: string;
}

export interface VendorModel {
  /** 供应商地址 */
  address: string;
  /** 供应商编号 */
  code: string;
  /** 联系人姓名1 */
  contactName1: string;
  /** 联系人姓名2 */
  contactName2: string;
  /** 联系人姓名3 */
  contactName3: string;
  /** 联系人电话1 */
  contactPhone1: string;
  /** 联系人电话2 */
  contactPhone2: string;
  /** 联系人电话3 */
  contactPhone3: string;
  /** 创建时间 */
  createTime: number;
  /** 创建人 ID */
  createUserId: number;
  /** ID */
  id: number;
  /** 接口对接客户信息 */
  interfaceCustomer: string;
  /** 供应商名称 */
  name: string;
  /** 供应商类型 */
  type: string;
  /** 更新时间 */
  updateTime: number;
  /** 更新人 ID */
  updateUserId: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export type VendorsListResultModel = BasicFetchListResult<VendorModel> & {
  interfaceCustomers: Nullable<string[]>;
};

export interface EditVendorResultModel {
  code: number;
}

export interface InterfaceCustomerModel {
  name: string;
}

export interface CreateVendorParams {
  /** 供应商地址 */
  address: string;
  /** 供应商编号 */
  code: string;
  /** 联系人姓名1 */
  contactName1: string;
  /** 联系人姓名2 */
  contactName2: string;
  /** 联系人姓名3 */
  contactName3: string;
  /** 联系人电话1 */
  contactPhone1: string;
  /** 联系人电话2 */
  contactPhone2: string;
  /** 联系人电话3 */
  contactPhone3: string;
  /** 接口对接客户信息 */
  interfaceCustomer: string;
  /** 供应商名称 */
  name: string;
  /** 供应商类型 */
  type: string;
}

export interface EditVendorParams extends CreateVendorParams {
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}
