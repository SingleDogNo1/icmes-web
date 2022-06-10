import { defHttp } from '/@/utils/http/axios';
import {
  GetWorkflowsListParam,
  GetWorkflowsListResultModel,
  CreateWorkflowParam,
  EditWorkflowParam,
  EditWorkflowResultModel,
  getWorkflowNodesListByIdParams,
  getWorkflowNodesListByIdResultModel,
  WorkflowNodeModel,
  CreateWorkflowNodeParam,
  EditWorkflowNodeParam,
} from './model/workflowModel';

enum Api {
  baseUrl = '/flow/workflows/',
}

/** 获取工作流列表-作者：孔轩 */
export function getWorkflowsListApi(params: GetWorkflowsListParam) {
  return defHttp.post<GetWorkflowsListResultModel>({
    url: Api.baseUrl + 'list/',
    params,
  });
}

/** 创建工作流信息-作者：王宇清 */
export function createWorkflowApi(params: CreateWorkflowParam) {
  return defHttp.post<EditWorkflowResultModel>({
    url: Api.baseUrl,
    params,
  });
}

/** 修改工作流信息-作者：王宇清 */
export function editWorkflowApi(id: number, params: EditWorkflowParam) {
  return defHttp.post<EditWorkflowResultModel>({
    url: Api.baseUrl + id,
    params,
  });
}

/** 删除工作流信息-作者：王宇清 */
export function delWorkflowApi(id: number) {
  return defHttp.delete<EditWorkflowResultModel>({
    url: Api.baseUrl + id,
  });
}

/** 发布工作流 */
export function publishWorkflowApi(id: number) {
  return defHttp.put<EditWorkflowResultModel>({
    url: Api.baseUrl + id + '/publish/',
  });
}

/** 获取工作流所属节点信息列表-作者：王宇清 */
export function getWorkflowNodesListByIdApi(id: number, params: getWorkflowNodesListByIdParams) {
  return defHttp.post<getWorkflowNodesListByIdResultModel>({
    url: Api.baseUrl + id + '/nodes/list/',
    params,
  });
}

/** 禁用工作流所属节点-作者：孔轩 */
export function disableWorkflowNodeApi(id, nodeId, params: { versionTag: string }) {
  return defHttp.put<{ code: string }>({
    url: `${Api.baseUrl}${id}/nodes/${nodeId}/disabled`,
    params,
  });
}

/** 启用工作流所属节点-作者：孔轩 */
export function enableWorkflowNodeApi(id, nodeId, params: { versionTag: string }) {
  return defHttp.put<{ code: string }>({
    url: `${Api.baseUrl}${id}/nodes/${nodeId}/enabled`,
    params,
  });
}

/** 获取工作流所属节点详细信息-作者：王宇清 */
export function getWorkflowNodeInfoApi(workflowId: number, nodeId: number) {
  return defHttp.get<WorkflowNodeModel>({
    url: `${Api.baseUrl}${workflowId}/nodes/${nodeId}`,
  });
}

/** 删除工作流所属节点信息-作者：梁勇帅 */
export function deleteWorkflowNodeApi(workflowId: number, nodeId: number) {
  return defHttp.delete<{ code: string }>({
    url: `${Api.baseUrl}${workflowId}/nodes/${nodeId}`,
  });
}

/** 创建工作流所属节点信息 */
export function createWorkflowNodeApi(id: number, params: CreateWorkflowNodeParam) {
  return defHttp.post<{ code: string }>({
    url: `${Api.baseUrl}${id}/nodes/`,
    params,
  });
}

/** 修改工作流所属节点信息 */
export function editWorkflowNodeApi(id: number, nodeId: number, params: EditWorkflowNodeParam) {
  return defHttp.put<{ code: string }>({
    url: `${Api.baseUrl}${id}/nodes/${nodeId}`,
    params,
  });
}
