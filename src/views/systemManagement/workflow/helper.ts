import {
  nodeTypeEnum,
  notificationPhaseEnum,
  reminderTypeEnum,
  workflowObjectTypeEnum,
} from '/@/enums/workflowEnum';
import type { WorkflowNodeModel } from '/@/api/flow/model/workflowModel';

export function parseNotificationPhaseText(val: notificationPhaseEnum) {
  switch (val) {
    case notificationPhaseEnum.BEFORE_OPERATION:
      return '任务执行前';
    case notificationPhaseEnum.OPERATION_COMPLETE:
      return '任务完成后';
    case notificationPhaseEnum.APPROVE_PASS:
      return '审批通过后';
    case notificationPhaseEnum.APPROVE_REJECT:
      return '审批驳回后';
    default:
      return '';
  }
}

export function parseReminderTypeText(workflowNodeData: Nullable<WorkflowNodeModel>, val: number) {
  if (workflowNodeData?.type === nodeTypeEnum.APPROVE && val === reminderTypeEnum.APPROVE) {
    return '审批';
  } else if (val === reminderTypeEnum.TASK) {
    return '任务';
  } else if (val === reminderTypeEnum.COPY) {
    return '抄送';
  } else if (val === reminderTypeEnum.NOTIFICATION) {
    return '通知';
  }
}

export function parseWorkflowObjectTypeText(val: workflowObjectTypeEnum) {
  switch (val) {
    case workflowObjectTypeEnum.USER:
      return '用户';
    case workflowObjectTypeEnum.ROLE:
      return '角色';
    case workflowObjectTypeEnum.ORGANIZATION:
      return '组织机构';
    case workflowObjectTypeEnum.ORG_USER:
      return '组织机构+角色';
    case workflowObjectTypeEnum.LAUNCHER:
      return '发起人';
    case workflowObjectTypeEnum.PREVIOUS_STEP:
      return '上一步执行人';
    case workflowObjectTypeEnum.POWER_CUT_CONTACT_PERSON:
      return '停送电联系人';
    default:
      return '';
  }
}
