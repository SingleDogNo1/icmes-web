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

import { ErrorMessageMode } from '/#/axios';

enum Api {
  workflow = '/flow/workflows/',
}

/** 获取工作流列表-作者：孔轩 */
export function getWorkflowsListApi(
  params: GetWorkflowsListParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<GetWorkflowsListResultModel>(
    {
      url: Api.workflow + 'list/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 创建工作流信息-作者：王宇清 */
export function createWorkflowApi(params: CreateWorkflowParam, mode: ErrorMessageMode = 'message') {
  return defHttp.post<EditWorkflowResultModel>(
    {
      url: Api.workflow,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 修改工作流信息-作者：王宇清 */
export function editWorkflowApi(
  id: number,
  params: EditWorkflowParam,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<EditWorkflowResultModel>(
    {
      url: Api.workflow + id,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 删除工作流信息-作者：王宇清 */
export function delWorkflowApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete<EditWorkflowResultModel>(
    {
      url: Api.workflow + id,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 发布工作流 */
export function publishWorkflowApi(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.put<EditWorkflowResultModel>(
    {
      url: Api.workflow + id + '/publish/',
    },
    {
      errorMessageMode: mode,
    },
  );
}

/** 获取工作流所属节点信息列表-作者：王宇清 */
export function getWorkflowNodesListByIdApi(
  id: number,
  params: getWorkflowNodesListByIdParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<getWorkflowNodesListByIdResultModel>(
    {
      url: Api.workflow + id + '/nodes/list/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
