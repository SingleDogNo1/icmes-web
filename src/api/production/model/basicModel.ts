/*
 * @Author: your name
 * @Date: 2021-10-12 18:15:58
 * @LastEditTime: 2021-10-12 18:30:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-vben-admin-main/src/api/production/model/basicModel.ts
 */
export interface DashboardRealTimeResultModel<T> {
  date: string;
  shiftName: string;
  T: T;
}
