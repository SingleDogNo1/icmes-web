import { defHttp } from '/@/utils/http/axios';
import {
  EmployeeModel,
  EditEmployeeInfoParam,
  EditEmployeeInfoResultModel,
} from './model/employeeModel';

enum Api {
  baseUrl = '/info/employees/',
}

/** 获取员工信息-作者：迟山 */
export function getEmployeeInfoByIdApi(id: string | number) {
  return defHttp.get<EmployeeModel>({
    url: Api.baseUrl + id,
  });
}

/** 修改员工信息-作者：迟山 */
export function editEmployeeInfoByIdApi(id: string | number, params: EditEmployeeInfoParam) {
  return defHttp.put<EditEmployeeInfoResultModel>({
    url: Api.baseUrl + id,
    params,
  });
}
