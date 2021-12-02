import { defHttp } from '/@/utils/http/axios';
import {
  EmployeeModel,
  EditEmployeeInfoParam,
  EditEmployeeInfoResultModel,
} from './model/employeeModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  employees = '/info/employees/',
}

/** 获取员工信息-作者：迟山 */
export function getEmployeeInfoByIdApi(id: string | number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<EmployeeModel>(
    {
      url: Api.employees + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改员工信息-作者：迟山 */
export function editEmployeeInfoByIdApi(
  id: string | number,
  params: EditEmployeeInfoParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put<EditEmployeeInfoResultModel>(
    {
      url: Api.employees + id,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
