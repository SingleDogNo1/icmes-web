import { defHttp } from '/@/utils/http/axios';
import {
  CreateEmployeeParams,
  EmployeeModel,
  EditEmployeeInfoParam,
  EditEmployeeInfoResultModel,
  GetEmployeesListParams,
  GetEmployeesListResultModel,
} from './model/employeeModel';

enum Api {
  baseUrl = '/info/employees/',
}

/** 创建员工-作者：迟山 */
export function createEmployeeApi(params: CreateEmployeeParams) {
  return defHttp.post<{ code: number }>({
    url: Api.baseUrl,
    params,
  });
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

/** 删除员工信息-作者：迟山 */
export function deleteEmployeeInfoByIdApi(id: string | number) {
  return defHttp.delete<{ code: number }>({
    url: Api.baseUrl + id,
  });
}

/** 获取员工列表-作者：迟山 */
export function getEmployeeListApi(params: GetEmployeesListParams) {
  return defHttp.post<GetEmployeesListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}
