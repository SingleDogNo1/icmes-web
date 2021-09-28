/** 获取系统配置接口返回数据 */
export interface RemoteConfigResultModel {
  defaultCallRecordDayPeriod: number;
  dicts: Dict[];
  features: Feature[];
  menus: Menu;
  needCheckPLCStatus: boolean;
  needFaceRecognition: boolean;
  passwordValidation: string;
  sipServerUri: String;
}

interface Dict {
  /** 数据字典是否被完全禁用 */
  disabled: boolean;
  /** 字典中文名 */
  name: string;
  options: {
    [index: string]: {
      /** 数据字典中的选项是否被禁用 */
      disabled: boolean;
      /** 数据字典中的选项中文名 */
      name: string;
      options: null;
      /** 数据字典中的选项排序字段，越小越靠前 */
      order: 0;
    };
  };
  /** 排序字段，越小越靠前 */
  order: number;
}

interface Feature {
  id: string;
  isFeature: boolean;
  label: string;
  children: Feature[];
}

export interface Menu {
  [index: string]: {
    /** 目录中文名 */
    name: string;
    /** 排序字段，越小越靠前 */
    order: number;
    childs: Menu | null;
  };
}
