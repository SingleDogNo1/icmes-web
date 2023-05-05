import { defHttp } from '/@/utils/http/axios';
import {
  GetMaintenanceOrdersParams,
  MaintenanceOrderCollection,
  MaintenanceOrderConfigurationModel,
  GetMaintenanceCommonMeasureParams,
  MaintenanceCommonMeasureModel,
  SaveMaintenanceCommonMeasureModel,
  ExportTypeEnum,
  ExportMaintenanceOrderResultModel,
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

/** 获取检修单配置(分离改造版)--作者：林松松 */
export function getMaintenanceOrdersConfigApi() {
  return defHttp.get<MaintenanceOrderConfigurationModel>({
    url: Api.baseUrl + 'config',
  });
}

/** 更新检修单配置(分离改造版)--作者：林松松 */
export function setMaintenanceOrdersConfigApi(params: MaintenanceOrderConfigurationModel) {
  return defHttp.put<{ code: string }>({
    url: Api.baseUrl + 'config',
    params,
  });
}

/** 分页查询检修单配置-通用措施列表--作者:林松松 */
export function getMaintenanceOrderCommonMeasureListApi(params: GetMaintenanceCommonMeasureParams) {
  return defHttp.post<MaintenanceCommonMeasureModel>({
    url: Api.baseUrl + 'CommonMeasure/list',
    params,
  });
}

/** 保存检修单配置-通用措施--作者：林松松 */
export function saveMaintenanceOrderCommonMeasureApi(params: SaveMaintenanceCommonMeasureModel) {
  return defHttp.post<{ code: string }>({
    url: Api.baseUrl + 'CommonMeasure',
    params,
  });
}

/** 检修单配置-删除通用措施--作者：林松松 */
export function deleteMaintenanceOrderCommonMeasureApi(id: number) {
  return defHttp.delete<{ code: string }>({
    url: Api.baseUrl + 'CommonMeasure/' + id,
  });
}

/** 导出检修单--作者：罗致 */
export function exportMaintenanceOrdersApi(exportType: ExportTypeEnum, ids: string) {
  return defHttp.post<ExportMaintenanceOrderResultModel>(
    {
      url: `${Api.baseUrl}export/${exportType}/${ids}`,
      responseType: 'arraybuffer',
    },
    {
      isReturnNativeResponse: true,
      isTransformResponse: false,
      formatDate: false,
      joinTime: false,
    },
  );
}
