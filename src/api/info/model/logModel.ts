import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface GetLogListParam {
  ascending: boolean;
  globalName: string;
  module: string;
  operate: string;
  operator: string;
  orderBy: string;
  pageNo: number;
  pageSize: number;
  terminal: string;
  terminalType: string;
  timeEnd: number;
  timeStart: number;
}

export interface LogModel {
  content: string;
  id: string;
  ip: string;
  module: string;
  operate: string;
  operator: string;
  terminalInfo: string;
  terminalType: string;
  time: number;
}

export type GetLogListResultModel = BasicFetchListResult<LogModel>;
