import { BasicFetchListResult } from '/@/api/model/baseModel';

export interface GetLocationListParams {
  /** 递归的层级次数0标识全部子孙 **/
  hierarchy?: number;
  /** 位置的上层位置标示 **/
  parentId?: number;
  /** 排序的字段名 **/
  orderBy?: string;
  /** 是否正序 **/
  ascending?: boolean;
  /** 一页多少条记录 0标识不分页全部显示 **/
  pageSize?: number;
  /** 当前页码数 **/
  pageNo?: number;
}

export interface LocationModel {
  /** 位置编码 */
  code: string;
  /** 工艺标识符 */
  id?: number;
  /** 位置名称 */
  name: string;
  /** 父项标识符 */
  parentId: number;
  /** 更新时间 */
  updateTime: number;
  /** 用于高并发的数据版本控制 */
  versionTag: string;
}

export interface LocationFullNameModel {
  /** 位置信息编码 */
  code: string;
  /** 位置信息全称 */
  fullName: string;
  /** 是否有子集 */
  hasChild: boolean;
  /** 位置信息ID */
  id: number;
  /** 位置信息名称 */
  name: string;
  /** 父级位置信息编码 */
  parentCode: string;
  /** 父级位置信息全称 */
  parentFullName: string;
  /** 父级位置信息ID */
  parentId: number;
  /** 版本标志 */
  versionTag: string;
}

export type GetLocationListResultModel = BasicFetchListResult<LocationFullNameModel>;
