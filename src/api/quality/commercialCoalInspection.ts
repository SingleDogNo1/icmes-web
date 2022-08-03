import { defHttp } from '/@/utils/http/axios';
import { customHttp } from '/@/utils/http/axios/axiosWithoutParse';
import {
  GetCommercialCoalInspectionListParams,
  GetCommercialCoalInspectionListResultModel,
  EditCommercialCoalInspectionParams,
} from './model/commercialCoalInspectionModel';

enum Api {
  baseUrl = '/quality/CommercialCoalInspection',
}

/** 商品煤检测表查询列表--作者：cxlu */
export function getApprovalsListApi(params: GetCommercialCoalInspectionListParams) {
  return defHttp.post<GetCommercialCoalInspectionListResultModel>({
    url: Api.baseUrl + '/list/',
    params,
  });
}

/** 商品煤检测根据批号验重--作者：luozhi */
export function checkBatchNumberApi(params: { batchNumber: string; id: number }) {
  return customHttp.post<{ data: boolean }>({
    url: Api.baseUrl + '/check/batchNumber',
    params,
  });
}

/** 商品煤检测表新增--作者：cxlu */
export function createCommercialCoalInspectionApi(params: EditCommercialCoalInspectionParams) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}

/** 商品煤检测表修改--作者：cxlu */
export function editCommercialCoalInspectionApi(
  id: number,
  params: EditCommercialCoalInspectionParams,
) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl + `/${id}`,
    params,
  });
}

/** 商品煤检测表删除--作者：gbilang */
export function delCommercialCoalInspectionApi(id: number) {
  return defHttp.delete<{ code: number }>({
    url: Api.baseUrl + `/${id}`,
  });
}

/** importData */
export function importCommercialCoalInspectionApi(params: { startTime: string; endTime: string }) {
  return customHttp.post<{ data: number }>({
    url: Api.baseUrl + '/import',
    params,
  });
}
