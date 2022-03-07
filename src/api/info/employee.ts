import { defHttp } from '/@/utils/http/axios';
import {
  EmployeeModel,
  EditEmployeeInfoParam,
  EditEmployeeInfoResultModel,
} from './model/employeeModel';

enum Api {
  employees = '/info/employees/',
}

/** 获取员工信息-作者：迟山 */
export function getEmployeeInfoByIdApi(id: string | number) {
  return defHttp.get<EmployeeModel>({
    url: Api.employees + id,
  });
}

/** 修改员工信息-作者：迟山 */
export function editEmployeeInfoByIdApi(id: string | number, params: EditEmployeeInfoParam) {
  return defHttp.put<EditEmployeeInfoResultModel>({
    url: Api.employees + id,
    params,
  });
}
