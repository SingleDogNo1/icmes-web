import { defHttp } from '/@/utils/http/axios';
import { CreateRepairOrderParam, CreateRepairOrderResultModel } from './model/repairModel';

enum Api {
  addRepairOrderByAlarm = '/maintenance/repairOrder/client',
}

/** 创建报修单接口(报警转报修)--作者：林松松 */
export function createRepairOrderApi(params: CreateRepairOrderParam) {
  return defHttp.post<CreateRepairOrderResultModel>({
    url: Api.addRepairOrderByAlarm,
    params,
  });
}
