import { defHttp } from '/@/utils/http/axios';
import {
  EditDistributionCabinetsDevicesParam,
  EditDistributionCabinetsParam,
  EditDistributionEntranceGuardsParam,
} from './model/distributionroomModel';
import {
  EditDistributionRoomParam,
  GetDistributionRoomListParam,
  GetDistributionRoomListResult,
} from './model/distributionroomModel';

enum Api {
  baseUrl = '/info/distributionroom/',
}

/** 获取配电室列表-作者：孔轩 */
export function getDistributionRoomListApi(params: GetDistributionRoomListParam) {
  return defHttp.post<GetDistributionRoomListResult>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 创建配电室列表-作者：孔轩 */
export function createDistributionRoomApi(params: EditDistributionRoomParam) {
  return defHttp.post<boolean>({
    url: Api.baseUrl,
    params,
  });
}

/** 编辑配电室列表-作者：孔轩 */
export function editDistributionRoomApi(params: EditDistributionRoomParam) {
  return defHttp.put<boolean>({
    url: Api.baseUrl + params.id,
    params,
  });
}

/** 删除配电室列表-作者：孔轩 */
export function delDistributionRoomApi(id: number) {
  return defHttp.delete<boolean>({
    url: Api.baseUrl + id,
  });
}

/** 获取配电室所属配电柜列表-作者：linan */
export function getDistributionCabinetsListApi(
  roomId: number,
  params: GetDistributionRoomListParam,
) {
  return defHttp.post<GetDistributionRoomListResult>({
    url: Api.baseUrl + roomId + '/cabinets/list',
    params,
  });
}

/** 创建配电柜信息-作者：linan */
export function createDistributionCabinetsApi(params: EditDistributionCabinetsParam) {
  return defHttp.post<boolean>({
    url: Api.baseUrl + params.roomId + '/cabinets',
    params,
  });
}

/** 编辑配电柜信息-作者：linan */
export function editDistributionCabinetsApi(params: EditDistributionCabinetsParam) {
  return defHttp.put<boolean>({
    url: Api.baseUrl + '/cabinets/' + params.id,
    params,
  });
}

/** 删除配电柜信息-作者：linan */
export function delDistributionCabinetsApi(id: number) {
  return defHttp.delete<boolean>({
    url: Api.baseUrl + '/cabinets/' + id,
  });
}

/** 获取配电室门禁信息列表-作者：孔轩 */
export function getDistributionEntranceGuardsListApi(
  roomId: number,
  params: GetDistributionRoomListParam,
) {
  return defHttp.post<GetDistributionRoomListResult>({
    url: Api.baseUrl + roomId + '/entrancegards/list',
    params,
  });
}

/** 创建门禁信息-作者：孔轩 */
export function createDistributionEntranceGuardsApi(params: EditDistributionEntranceGuardsParam) {
  return defHttp.post<boolean>({
    url: Api.baseUrl + params.roomId + '/entrancegards',
    params,
  });
}

/** 编辑配门信息-作者：孔轩 */
export function editDistributionEntranceGuardsApi(params: EditDistributionEntranceGuardsParam) {
  return defHttp.put<boolean>({
    url: Api.baseUrl + params.roomId + '/entrancegards/' + params.id,
    params,
  });
}

/** 删除门禁信息-作者：孔轩 */
export function delDistributionEntranceGuardsApi(roomId: number, id: number) {
  return defHttp.delete<boolean>({
    url: Api.baseUrl + roomId + '/entrancegards/' + id,
  });
}

/** 配置设备-作者：孔轩 */
export function editDistributionCabinetsDevicesApi(params: EditDistributionCabinetsDevicesParam) {
  return defHttp.put<boolean>({
    url: Api.baseUrl + '/cabinets/' + params.id + '/devices/',
    params,
  });
}
