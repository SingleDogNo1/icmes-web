export interface CreateRepairOrderParam {
  /** 报警内容 */
  alarmContent: string;
  /** 报警Id */
  alarmId: number;
  /** 报警对象 */
  alarmObject: string;
  /** 创建报警角色 ID */
  createUserId: number;
  /** 报警结束时间 */
  endTime: number;
  /** 报警类别 */
  kind: string;
  /** 报警级别 */
  level: string;
  /** 报警转报修时处理意见 */
  maintenanceOpinions: string;
  /** 报警对象标识符（配点对象标识或设备标识） */
  relativeObjectId: number;
  /** 报警对象类型（1、配点对象，2、设备） */
  relativeObjectType: number;
  /** 报警开始时间 */
  startTime: number;
  updateUserId: number;
  /** 报警内容版本号 */
  versionTag: string;
}

export interface CreateRepairOrderResultModel {
  data: string;
}
