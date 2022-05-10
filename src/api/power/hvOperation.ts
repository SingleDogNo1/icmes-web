import { defHttp } from '/@/utils/http/axios';
import {
  GetHvOperationParams,
  GetHvOperationTemplateResultModel,
  ToggleHvOperationTemplateParams,
  UpdateHvOperationParams,
  UpdateHvOperationDevicesParams,
} from './model/hvOperationModel';

enum Api {
  baseUrl = '/power/hvOperation/',
}

/** 查询高压操作票配置列表--作者：lih */
export function getHvOperationTicketConfigListApi(params: GetHvOperationParams) {
  return defHttp.post<GetHvOperationTemplateResultModel>({
    url: Api.baseUrl + 'list',
    params,
  });
}

/** 启用禁用高压票模板--作者：lih */
export function toggleHvOperationTicketTemplateApi(params: ToggleHvOperationTemplateParams) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl + 'operation',
    params,
  });
}

/** 新增高压操作票模板--作者：lih */
export function createHvOperationApi(params: UpdateHvOperationParams) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改高压操作票模板--作者：lih */
export function updateHvOperationApi(id: number, params: UpdateHvOperationParams) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 删除高压操作票模板--作者：lih */
export function deleteHvOperationApi(id: number) {
  return defHttp.delete<{ code: number }>({
    url: Api.baseUrl + id,
  });
}

/** 高压票模板配置设备设置范围--作者：lih */
export function UpdateHvOperationDevicesApi(id: number, params: UpdateHvOperationDevicesParams) {
  return defHttp.put<{ code: number }>({
    url: Api.baseUrl + id,
    params,
  });
}
