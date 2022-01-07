import { defHttp } from '/@/utils/http/axios';
import {
  GetVendorsListParams,
  VendorsListResultModel,
  EditVendorResultModel,
  InterfaceCustomerModel,
  CreateVendorParams,
  EditVendorParams,
} from './model/vendorModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  basicUrl = '/info/vendors',
}

/** 获取厂商列表-作者：戴常怡 */
export function getVendorsListApi(
  params: GetVendorsListParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<VendorsListResultModel>(
    {
      url: Api.basicUrl + '/list/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 获取接口对接客户信息列表-作者：徐宏亮 */
export function getVendorInterfaceApi(mode: ErrorMessageMode = 'message') {
  return defHttp.post<InterfaceCustomerModel[]>(
    {
      url: Api.basicUrl + '/customer/list/',
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 删除厂商信息-作者：戴常怡 */
export function delVendorApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<EditVendorResultModel>(
    {
      url: `${Api.basicUrl}/${id}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 创建厂商信息-作者：戴常怡 */
export function createVendorApi(params: CreateVendorParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<EditVendorResultModel>(
    {
      url: `${Api.basicUrl}/`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改厂商信息-作者：戴常怡 */
export function editVendorApi(
  id: number,
  params: EditVendorParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<EditVendorResultModel>(
    {
      url: `${Api.basicUrl}/${id}`,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
