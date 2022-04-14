import { defHttp } from '/@/utils/http/axios';
import {
  GetDictTypesParam,
  GetDictTypesResultModel,
  AddDictTypeParam,
  AddDictTypeResultModel,
  EditDictTypeParam,
  EditDictTypeResultModel,
  GetDictDataParam,
  GetDictDataResultModel,
  AddDictDataParam,
  UpdateDictDataParam,
  DisabledDictDataParam,
  EnabledDictDataParam,
} from './model/dictModel';

enum Api {
  dictTypeUrl = '/info/dictTypes/',
  dictDataUrl = '/info/dictDatas/',
}

/** 字典类型查询--作者：何秋菊 */
export function getDictTypesListApi(params: GetDictTypesParam) {
  return defHttp.post<GetDictTypesResultModel>({
    url: Api.dictTypeUrl + 'list/',
    params,
  });
}

/** 新增字典类型-作者：何秋菊 */
export function addDictTypeApi(params: AddDictTypeParam) {
  return defHttp.post<AddDictTypeResultModel>({
    url: Api.dictTypeUrl,
    params,
  });
}

/** 修改字典类型-作者：何秋菊 */
export function editDictTypeApi(params: EditDictTypeParam) {
  return defHttp.put<EditDictTypeResultModel>({
    url: Api.dictTypeUrl + params.code,
    params,
  });
}

/** 删除字典类型-作者：何秋菊 */
export function deleteDictTypeApi(code: string) {
  return defHttp.delete<boolean>({
    url: Api.dictTypeUrl + code,
  });
}

/** 字典类型详情-作者：何秋菊 */
export function getDictDataApi(params: GetDictDataParam) {
  return defHttp.post<GetDictDataResultModel>({
    url: Api.dictDataUrl + 'list/',
    params,
  });
}

/** 新增字典数据-作者：何秋菊 */
export function addDictDataApi(params: AddDictDataParam) {
  return defHttp.post<boolean>({
    url: Api.dictDataUrl,
    params,
  });
}

/** 修改字典数据-作者：何秋菊 */
export function updateDictDataApi(code: string, params: UpdateDictDataParam) {
  return defHttp.put<boolean>({
    url: Api.dictDataUrl + params.typeCode + '/' + code,
    params,
  });
}

/** 禁用字典数据-作者：何秋菊 */
export function disabledDictDataApi(typeCode: string, code: string, params: DisabledDictDataParam) {
  return defHttp.put<boolean>({
    url: Api.dictDataUrl + typeCode + '/' + code + '/disabled',
    params,
  });
}

/** 启用字典数据-作者：何秋菊 */
export function enabledDictDataApi(typeCode: string, code: string, params: EnabledDictDataParam) {
  return defHttp.put<boolean>({
    url: Api.dictDataUrl + typeCode + '/' + code + '/enabled',
    params,
  });
}

/** 字典数据删除-作者：何秋菊 */
export function deleteDictDataApi(typeCode: string, code: string) {
  return defHttp.delete<boolean>({
    url: Api.dictDataUrl + typeCode + '/' + code,
  });
}
