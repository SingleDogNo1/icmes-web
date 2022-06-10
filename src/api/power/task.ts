import { defHttp } from '/@/utils/http/axios';
import { CountByDistributionRoomModel } from './model/taskModel';

enum Api {
  baseUrl = '/power/task/',
}

/** 以配电室维度，查询任务数量-作者：李辉 */
export function getDistributionRoomApi() {
  return defHttp.get<CountByDistributionRoomModel>({
    url: Api.baseUrl + 'distributionRoom',
  });
}
