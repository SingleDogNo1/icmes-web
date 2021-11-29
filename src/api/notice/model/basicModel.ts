export interface GetUnreadNoticeApiResultModel {
  /** 报警数 */
  alarmNum: number;
  /** 审批数 */
  approvalNum: number;
  /** 抄送数 */
  carbonNum: number;
  /** 未读消息数 */
  messageNum: number;
  /** 任务数 */
  taskNum: number;
}
