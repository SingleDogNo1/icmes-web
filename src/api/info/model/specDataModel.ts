export interface SpecDataResultModel {
  /** 规格类型标识符 */
  id: number;
  /** 规格类型名称 */
  name: string;
  specDataList: SpecDataModel[];
}

export interface SpecDataModel {
  /** 规格标识符 */
  id: number;
  /** 规格模版数据呈现方式 false - 标签属性，true - 输入框属性 */
  isExtraDisplayMode: boolean;
  /** 规格名称 */
  name: string;
  /** 规格单位 */
  unit: string;
}
