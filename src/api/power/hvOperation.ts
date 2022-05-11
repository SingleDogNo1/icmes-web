import { defHttp } from '/@/utils/http/axios';
import {
  GetHvOperationParams,
  GetHvOperationTemplateResultModel,
  ToggleHvOperationTemplateParams,
  UpdateHvOperationParams,
  UpdateHvOperationDevicesParams,
  HvOperateTemplateAdvanceModel,
  UpdateHvOperationTemplateStepParams,
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

/** 根据设备ID查询高压操作票列表--作者：lih */
export function getHvOperationApi(id: string) {
  return defHttp.get<HvOperateTemplateAdvanceModel>({
    url: Api.baseUrl + id,
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

/** 高压票模板配置步骤--作者：lih */
export function UpdateHvOperationTicketStepApi(
  id: string,
  params: UpdateHvOperationTemplateStepParams,
) {
  return defHttp.put<{ code: number }>({
    url: `${Api.baseUrl}step/${id}`,
    params,
  });
}
