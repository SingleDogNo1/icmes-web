export interface GetPowerCutConfigParams {
  /** 是否正序 */
  ascending: boolean;
  /** 是否只返回启用的 */
  onlyNeedUse: boolean;
  /** 排序的字段名 */
  orderBy: string;
  /** Null为查询所有  */
  organizationId?: number;
  /** 当前页码数 */
  pageNo: number;
  /** 一页多少条记录 0标识不分页全部显示 */
  pageSize: number;
}

export interface PowerCutConfigResultModel {
  items: Nullable<PowerCutConfigExtendEntity[]>;
  totalCount: number;
  totalPages: number;
  workFlowCodes: string[];
}

export interface PowerCutConfigExtendEntity {
  configId: number;
  name: string;
  organizationEntityList: PowerCutConfigOrganization[];
  powerCutType: number;
  remark: string;
  useful: boolean;
  workFlowCode: string;
}

export interface PowerCutConfigOrganization {
  organizationId: number;
  organizationName: string;
}

export interface EditPowerCutConfigResultModel {
  code: string | number;
}

export interface EditPowerCutConfigModel {
  configId: number;
  name: string;
  organizationIds: number[];
  powerCutType: number;
  remark: string;
  workFlowCode: string;
}
