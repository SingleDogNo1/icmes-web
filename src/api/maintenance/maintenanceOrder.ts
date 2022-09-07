import { defHttp } from '/@/utils/http/axios';
import {
  GetMaintenanceOrdersParams,
  MaintenanceOrderCollection,
} from './model/maintenanceOrderModel';

enum Api {
  baseUrl = '/maintenance/maintenanceOrders/',
}

/** 查询检修单列表 */
export function getMaintenanceOrdersApi(params: GetMaintenanceOrdersParams) {
  return defHttp.post<MaintenanceOrderCollection>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
