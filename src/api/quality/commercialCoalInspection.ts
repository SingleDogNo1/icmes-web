import { defHttp } from '/@/utils/http/axios';
import {
  GetCommercialCoalInspectionListParams,
  GetCommercialCoalInspectionListResultModel,
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
