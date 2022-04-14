import { defHttp } from '/@/utils/http/axios';
import {
  GetVendorsListParams,
  VendorsListResultModel,
  EditVendorResultModel,
  InterfaceCustomerModel,
  CreateVendorParams,
  EditVendorParams,
} from './model/vendorModel';

enum Api {
  basicUrl = '/info/vendors/',
}

/** 获取厂商列表-作者：戴常怡 */
export function getVendorsListApi(params: GetVendorsListParams) {
  return defHttp.post<VendorsListResultModel>({
    url: Api.basicUrl + 'list/',
    params,
  });
}

/** 获取接口对接客户信息列表-作者：徐宏亮 */
export function getVendorInterfaceApi() {
  return defHttp.post<InterfaceCustomerModel[]>({
    url: Api.basicUrl + 'customer/list/',
  });
}

/** 删除厂商信息-作者：戴常怡 */
export function delVendorApi(id: number) {
  return defHttp.delete<EditVendorResultModel>({
    url: Api.basicUrl + id,
  });
}

/** 创建厂商信息-作者：戴常怡 */
export function createVendorApi(params: CreateVendorParams) {
  return defHttp.post<EditVendorResultModel>({
    url: Api.basicUrl,
    params,
  });
}

/** 修改厂商信息-作者：戴常怡 */
export function editVendorApi(id: number, params: EditVendorParams) {
  return defHttp.put<EditVendorResultModel>({
    url: `${Api.basicUrl}/${id}`,
    params,
  });
}
