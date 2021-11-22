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

import { ErrorMessageMode } from '/#/axios';

enum Api {
  getDictTypesList = '/info/dictTypes/list/',
  editDictType = '/info/dictTypes/',
  getDictDataList = '/info/dictDatas/list/',
  editDictData = '/info/dictDatas/',
}

/** 字典类型查询--作者：何秋菊 */
export function getDictTypesListApi(params: GetDictTypesParam, mode: ErrorMessageMode = 'message') {
  return defHttp.post<GetDictTypesResultModel>(
    {
      url: Api.getDictTypesList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 新增字典类型-作者：何秋菊 */
export function addDictTypeApi(params: AddDictTypeParam, mode: ErrorMessageMode = 'message') {
  return defHttp.post<AddDictTypeResultModel>(
    {
      url: Api.editDictType,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改字典类型-作者：何秋菊 */
export function editDictTypeApi(params: EditDictTypeParam, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditDictTypeResultModel>(
    {
      url: Api.editDictType + params.code,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 删除字典类型-作者：何秋菊 */
export function deleteDictTypeApi(code: string, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<boolean>(
    {
      url: Api.editDictType + code,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 字典类型详情-作者：何秋菊 */
export function getDictDataApi(params: GetDictDataParam, mode: ErrorMessageMode = 'message') {
  return defHttp.post<GetDictDataResultModel>(
    {
      url: Api.getDictDataList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 新增字典数据-作者：何秋菊 */
export function addDictDataApi(params: AddDictDataParam, mode: ErrorMessageMode = 'message') {
  return defHttp.post<boolean>(
    {
      url: Api.editDictData,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改字典数据-作者：何秋菊 */
export function updateDictDataApi(
  code: string,
  params: UpdateDictDataParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<boolean>(
    {
      url: Api.editDictData + params.typeCode + '/' + code,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 禁用字典数据-作者：何秋菊 */
export function disabledDictDataApi(
  typeCode: string,
  code: string,
  params: DisabledDictDataParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<boolean>(
    {
      url: Api.editDictData + typeCode + '/' + code + '/disabled',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 启用字典数据-作者：何秋菊 */
export function enabledDictDataApi(
  typeCode: string,
  code: string,
  params: EnabledDictDataParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<boolean>(
    {
      url: Api.editDictData + typeCode + '/' + code + '/enabled',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 字典数据删除-作者：何秋菊 */
export function deleteDictDataApi(
  typeCode: string,
  code: string,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.delete<boolean>(
    {
      url: Api.editDictData + typeCode + '/' + code,
    },
    {
      errorMessageMode: mode,
    },
  );
}
