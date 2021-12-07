import { defHttp } from '/@/utils/http/axios';
import { GetTaskListParams, GetTaskListResultModel } from './model/taskModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  taskList = '/notice/tasks/list/',
}

/** 任务列表查询--作者：*/
export function getTasksListApi(params: GetTaskListParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<GetTaskListResultModel>(
    {
      url: Api.taskList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
