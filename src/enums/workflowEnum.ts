export enum workflowNodeTypeEnum {
  /** 会签 */
  ADD = 0,
  /** 或签 */
  OR = 1,
}

export enum workflowObjectTypeEnum {
  /** 用户 */
  USER,
  /** 角色 */
  ROLE,
  /** 组织机构 */
  ORGANIZATION,
  /** 组织机构+角色 */
  ORG_USER,
  /** 发起人 */
  LAUNCHER,
  /** 上一步执行人 */
  PREVIOUS_STEP,
  /** 停送电联系人 */
  POWER_CUT_CONTACT_PERSON,
}

export enum notificationPhaseEnum {
  /** 任务执行前 */
  BEFORE_OPERATION,
  /** 任务完成后 */
  OPERATION_COMPLETE,
  /** 审批通过后 */
  APPROVE_PASS,
  /** 审批驳回后 */
  APPROVE_REJECT,
}

export enum reminderTypeEnum {
  /** 任务 */
  TASK,
  /** 审批 */
  APPROVE,
  /** 抄送 */
  COPY,
  /** 通知 */
  NOTIFICATION,
}

export enum nodeTypeEnum {
  /** 操作 */
  OPERATION,
  /** 审批 */
  APPROVE,
}
