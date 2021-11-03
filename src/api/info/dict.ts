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
} from './model/dictModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  /** 字典类型查询 */
  getDictTypesList = '/info/dictTypes/list/',
  /** 新增/修改/删除字典类型 */
  editDictType = '/info/dictTypes/',
  /** 字典数据列表查询 */
  getDictDataList = '/info/dictDatas/list/',
  /** 新增/查询/删除/修改/启用/禁用字典数据 */
  editDictData = '/info/dictDatas/',
}

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
