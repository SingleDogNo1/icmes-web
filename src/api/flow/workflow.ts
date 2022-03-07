import { defHttp } from '/@/utils/http/axios';
import {
  GetWorkflowsListParam,
  GetWorkflowsListResultModel,
  CreateWorkflowParam,
  EditWorkflowParam,
  EditWorkflowResultModel,
  getWorkflowNodesListByIdParams,
  getWorkflowNodesListByIdResultModel,
} from './model/workflowModel';

enum Api {
  workflow = '/flow/workflows/',
}

/** 获取工作流列表-作者：孔轩 */
export function getWorkflowsListApi(params: GetWorkflowsListParam) {
  return defHttp.post<GetWorkflowsListResultModel>({
    url: Api.workflow + 'list/',
    params,
  });
}

/** 创建工作流信息-作者：王宇清 */
export function createWorkflowApi(params: CreateWorkflowParam) {
  return defHttp.post<EditWorkflowResultModel>({
    url: Api.workflow,
    params,
  });
}

/** 修改工作流信息-作者：王宇清 */
export function editWorkflowApi(id: number, params: EditWorkflowParam) {
  return defHttp.post<EditWorkflowResultModel>({
    url: Api.workflow + id,
    params,
  });
}

/** 删除工作流信息-作者：王宇清 */
export function delWorkflowApi(id: number) {
  return defHttp.delete<EditWorkflowResultModel>({
    url: Api.workflow + id,
  });
}

/** 发布工作流 */
export function publishWorkflowApi(id: number) {
  return defHttp.put<EditWorkflowResultModel>({
    url: Api.workflow + id + '/publish/',
  });
}

/** 获取工作流所属节点信息列表-作者：王宇清 */
export function getWorkflowNodesListByIdApi(id: number, params: getWorkflowNodesListByIdParams) {
  return defHttp.post<getWorkflowNodesListByIdResultModel>({
    url: Api.workflow + id + '/nodes/list/',
    params,
  });
}
