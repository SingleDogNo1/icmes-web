export interface powerCutConfigListParams {
  /** 正序倒序 */
  ascending?: boolean;
  /** 是否只返回启用的 */
  onlyNeedUse?: boolean;
  /** 排序的字段名 */
  orderBy?: string;
  /** 组织id,Null为查询所有 */
  organizationId?: number;
  /** 当前页码数 */
  pageNo?: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize?: number;
}

export interface powerCutConfigListResultModel {
  items: PowerCutConfigCollectionModel[];
  totalCount: number;
  totalPages: number;
  /** 工作流编码 */
  workFlowCodes: string[];
}

export interface PowerCutConfigCollectionModel {
  /** 配置id */
  configId: number;
  /** 配置名称 */
  name: string;
  /**  使用部门 */
  organizationEntityList: PowerCutConfigOrganizationModel[];
  /** 停送电类型 */
  powerCutType: number;
  /** 备注 */
  remark: string;
  /** 是否启用 */
  useful: boolean;
  /** 工作流编码 */
  workFlowCode: string;
}

export interface PowerCutConfigOrganizationModel {
  /** 组织id */
  organizationId: number;
  /** 组织名称 */
  organizationName: string;
}
