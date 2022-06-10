import {
  workflowNodeTypeEnum,
  reportingObjectTypeEnum,
  reminderTypeEnum,
  notificationPhaseEnum,
  nodeTypeEnum,
  workflowObjectTypeEnum,
} from '/@/enums/workflowEnum';

export interface GetWorkflowsListParam {
  /** 是否正序 */
  ascending: boolean;
  /** 业务类型 */
  businessType: string;
  /** 工作流编号/名称 */
  codeOrName: string;
  /** 排序的字段名 */
  orderBy?: string;
  /** 当前页码 */
  pageNo: number;
  /** 每页多少条记录 0表示不分页 */
  pageSize: number;
}

export interface GetWorkflowsListResultModel {
  items: Nullable<WorkFlowModel[]>;
  /** 数据总条数 */
  totalCount: number;
  /** 数据总页数 */
  totalPages: number;
}

export interface WorkFlowModel {
  businessType: string;
  code: string;
  createTime: number;
  createUserId: number;
  id: number;
  isDeploy: boolean;
  name: string;
  updateTime: number;
  updateUserId: number;
  versionTag: string;
}

export interface CreateWorkflowParam {
  /** 业务类型 */
  businessType: string;
  /** 工作流编号 */
  code: string;
  /** 工作流名称 */
  name: string;
}

export interface EditWorkflowParam {
  /** 是否启用 */
  isDeploy?: boolean;
  /** 控制高并发版本号 */
  versionTag: string;
  /** 工作流名称 */
  name: string;
}

export interface EditWorkflowResultModel {
  code: number;
}

export interface getWorkflowNodesListByIdParams {
  pageNo: number;
  pageSize: number;
}

export interface getWorkflowNodesListByIdResultModel {
  totalCount: number;
  totalPages: number;
  items: Nullable<WorkflowNodeModel[]>;
}

export interface WorkflowNodeModel {
  code: string;
  formKey: string;
  id: number;
  isDisabled: boolean;
  isImmediatelyExecute: boolean;
  isReminderOn: boolean;
  isReportOn: boolean;
  isSystemAutoExec: boolean;
  method: workflowNodeTypeEnum;
  name: string;
  nodeReminderList: ReminderModel[];
  nodeReportingList: ReportingModel[];
  numberOfSigned: number;
  operateFailureStatus: string;
  operateSuccessStatus: string;
  order: number;
  redirectToNodeId: number;
  reminderInterval: number;
  reminderMaxNum: number;
  type: nodeTypeEnum;
  versionTag: string;
}

export interface ReminderModel {
  id: number;
  isWorkingShiftNoticeOn: boolean;
  jsonParseObjectInfo: string;
  notificationObject: string;
  notificationObjectType: workflowObjectTypeEnum;
  notificationPhase: notificationPhaseEnum;
  type: reminderTypeEnum;
  verification: string;
  versionTag: string;
  workflowNodeId: number;
}

export interface ReportingModel {
  createTime: number;
  createUserId: number;
  id: number;
  isWorkingShiftNoticeOn: boolean;
  jsonParseObjectInfo: string;
  reportingObject: string;
  reportingObjectType: reportingObjectTypeEnum;
  timeoutPeriod: number;
  updateTime: number;
  updateUserId: number;
  verification: string;
  versionTag: string;
  workflowNodeId: number;
}

export interface WorkflowNodeModel {
  code: string;
  formKey: string;
  id: number;
  isDisabled: boolean;
  isImmediatelyExecute: boolean;
  isReminderOn: boolean;
  isReportOn: boolean;
  isSystemAutoExec: boolean;
  method: workflowNodeTypeEnum;
  name: string;
  nodeReminderList: Nullable<ReminderModel[]>;
  nodeReportingList: Nullable<ReportingModel[]>;
  numberOfSigned: number;
  operateFailureStatus: string;
  operateSuccessStatus: string;
  order: number;
  redirectToNodeId: number;
  reminderInterval: number;
  reminderMaxNum: number;
  type: nodeTypeEnum;
  versionTag: string;
}

export interface CreateWorkflowNodeParam {
  /** 节点编码 */
  code: string;
  /** 调用页面 */
  formKey: string;
  /** 是否节点延迟执行 */
  isImmediatelyExecute: boolean;
  /** 是否系统自动执行 */
  isSystemAutoExec: boolean;
  /** 操作方式 */
  method: workflowNodeTypeEnum;
  /** 节点名称 */
  name: string;
  /** 或签人数 */
  numberOfSigned: number;
  /** 驳回审批状态 */
  operateFailureStatus: string;
  /** 操作成功状态/通过审批状态 */
  operateSuccessStatus: string;
  /** 步骤序号 */
  order: number;
  /** 驳回跳转步骤编号 */
  redirectToNodeId: number;
  /** 工作类型 */
  type: nodeTypeEnum;
}

export interface EditWorkflowNodeParam extends CreateWorkflowNodeParam {
  /** 用于版本控制 */
  versionTag: string;
}
