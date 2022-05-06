/** PLC监测类型 */
export enum DevicePLCDetectTypeEnum {
  /** 只监测运行状态 */
  ONLY_RUN = 1,
  /** 只监测带电状态 */
  ONLY_ELEC = 2,
  /** 监测运行状态+带电状态 */
  RUN_AND_ELEC = 3,
  /** 只监测就地状态 */
  ONLY_SPOT = 4,
  /** 参与停送电流程，无电工配电操作 */
  JOIN_POWER_CUT_FLOW = 5,
  /** 不参与停送电流程 */
  NOT_JOIN_POWER_CUT_FLOW = 6,
  /** 监测运行状态+带电状态+就地状态 */
  RUN_AND_ELEC_AND_SPOT = 7,
  /** 监测运行状态+就地状态 */
  RUN_AND_SPOT = 8,
  /** 监测带电状态+就地状态 */
  ELEC_AND_SPOT = 9,
}
