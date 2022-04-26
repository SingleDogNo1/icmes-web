export enum DevicePLCDetectTypeEnum {
  /** 不检测状态信号 **/
  NONE = 0,
  /** 只监测运行状态 **/
  ONLY_RUNNING = 1,
  /** 只监测带电状态 **/
  ONLY_ELECTRIFIED = 2,
  /** 监测运行状态+带电状态 **/
  RUNNING_ELECTRIFIED = 3,
  /** 只监测就地状态   **/
  ONLY_LOCAL = 4,
  /** 参与停送电流程，无电工配电操作 **/
  NONE_DISTRIBUTION = 5,
  /** 不参与停送电流程 **/
  NONE_JOIN = 6,
  /** 监测运行状态+带电状态+就地状态 **/
  RUNNING_ELECTRIFIED_LOCAL = 7,
  /** 监测就地状态+运行状态 **/
  LOCAL_RUNNING = 8,
  /** 监测就地状态+带电状态 **/
  LOCAL_ELECTRIFIED = 9,
  /** 未知 **/
  UNKNOWN = -1,
}
