import { defHttp } from '/@/utils/http/axios';
import {
  GetStockHistoryParams,
  SparePartStockCollection,
  CreateInStockParams,
  UpdateInStockParams,
  CreateOutStockParams,
  UpdateOutStockParams,
  SparePartStockHistoryAdvanceModel,
  GetSparePartStocksListByIdParams,
  UpdateSettingParams,
} from './model/sparePartStocksModel';

enum Api {
  baseUrl = '/info/sparePartStocks',
}

/** 新建入库单-作者：杨晓飞 */
export function createInStockSparePartsApi(params: CreateInStockParams) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl + '/instock/',
    params,
  });
}

/** 查询入库详细-作者：郑宇清 */
export function getInStockSparePartsApi(id) {
  return defHttp.get<SparePartStockHistoryAdvanceModel>({
    url: Api.baseUrl + '/instock/' + id,
  });
}

/** 编辑入库单-作者：杨晓飞 */
export function updateInStockSparePartsApi(id: number, params: UpdateInStockParams) {
  return defHttp.put<{ code: string }>({
    url: Api.baseUrl + '/instock/' + id,
    params,
  });
}

/** 删除入库记录-作者：李瑞强 */
export function delInStockSparePartsApi(id: number) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + '/instock/' + id,
  });
}

/** 获取出入库列表--作者：李瑞强 */
export function getSparePartStocksListApi(params: GetStockHistoryParams) {
  return defHttp.post<SparePartStockCollection>({
    url: Api.baseUrl + '/list/',
    params,
  });
}

/** 根据指定备件ID查询出入库历史列表--作者：李楠 */
export function getSparePartStocksListByIdApi(id, params: GetSparePartStocksListByIdParams) {
  return defHttp.post({
    url: Api.baseUrl + '/list/' + id,
    params,
  });
}

/** 新建出库单-作者：杨晓飞 */
export function createOutStockSparePartsApi(params: CreateOutStockParams) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl + '/outstock/',
    params,
  });
}

/** 查询出库详细-作者：郑宇清 */
export function getOutStockSparePartsApi(id: number) {
  return defHttp.get<SparePartStockHistoryAdvanceModel>({
    url: Api.baseUrl + '/outstock/' + id,
  });
}

/** 编辑出库单-作者：杨晓飞 */
export function updateOutStockSparePartsApi(id: number, params: UpdateOutStockParams) {
  return defHttp.put<{ code: string }>({
    url: Api.baseUrl + '/outstock/' + id,
    params,
  });
}

/** 删除出库记录-作者：李瑞强 */
export function delOutStockSparePartsApi(id: number) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + '/outstock/' + id,
  });
}

/** 锁定配置-作者：李楠 */
export function updateStockSparePartsSettingApi(id: number, params: UpdateSettingParams) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl + '/setting/' + id,
    params,
  });
}
