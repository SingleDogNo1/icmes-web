export interface CountByDistributionRoomModel {
  /** 待停电任务数量 **/
  cutNum: number;
  /** 配电室Code **/
  distributionRoomCode: string;
  /** 配电室ID **/
  distributionRoomId: number;
  /** 配电室名称 **/
  distributionRoomName: string;
  /** 进行中任务数量 **/
  duringNum: number;
  /** 异常远操配电操作总数 **/
  errorTaskNum: number;
  /** 待送电任务数量 **/
  supplyNum: number;
  /** 今日完成任务数量 **/
  todayCompleteNum: number;
}
