export interface DispatchDailyAccidentModel {
  /** 描述 */
  description: string;
  /** 设备 */
  devices: string;
  /** 事故时间-时长 */
  periodTime: string;
  /** 系统 */
  systems: string;
  /** 影响时段 */
  times: string;
  /** 分类 */
  type: string;
}

export interface DispatchDailyTableYieldBlankInnerModel {
  /** 浮选各设备板数，key为设备号 */
  flotationBlanks: Record<string, number>;
  /** 浮选各设备板数合计 */
  flotationBlanksSum: number;
  /** 煤泥各设备板数，key为设备号 */
  slimeBlanks: Record<string, number>;
  /** 煤泥各设备板数合计 */
  slimeBlanksSum: number;
}

export interface DispatchDailyBunkerInnerModel {
  /** key: 煤仓名 */
  bunkers: Record<string, number[]>;
}

export interface DispatchDailyBunkerInnerManualModel {
  /** 储煤场2#精煤 */
  cleanCoal: number;
  /** 储煤场洗混煤 */
  mixedCoal: number;
  /** 储煤场煤泥 */
  slime: number;
  /** 煤泥棚 */
  slimeShed: number;
}

export interface DispatchDailyCommercialCoalInspectionModel {
  /** 内灰 */
  ad: number;
  /** 流向 */
  direction: string;
  /** 全水 */
  mt: number;
  /** 产品 */
  productionVariety: string;
  /**发运量 */
  tonnage: number;
}

export interface DispatchDailyDeviceOperationDataModel {
  /** 全天运行时间 */
  allDay: Record<string, string>;
  /** 白班运行时间 */
  day: Record<string, string>;
  /** 月累计运行时间 */
  month: Record<string, string>;
  /** 夜班运行时间 */
  night: Record<string, string>;
}

export interface DispatchDailyTableEnergyInnerModel {
  /** 电能累计 */
  elecSum: number;
  /** 电能吨耗 */
  elecTon: number;
  /** 絮凝剂累计 */
  flocculantSum: number;
  /** 絮凝剂吨耗 */
  flocculantTon: number;
  /** 浮选药剂累计 */
  flotationSum: number;
  /** 浮选药剂吨耗 */
  flotationTon: number;
  /** 主洗介质累计 */
  mainWashSum: number;
  /** 主洗介质吨耗 */
  mainWashTon: number;
  /** 原煤介质累计 */
  rawCoalSum: number;
  /** 原煤介质吨耗 */
  rawCoalTon: number;
}

export interface DispatchDailyTableProductivityInnerModel {
  /** 精煤 */
  cleanCoal: number;
  /** 浮选精煤 */
  flotationCleanCoal: number;
  /** 洗混煤 */
  mixedCoal: number;
  /** 商品煤 */
  salableCoal: number;
  /** 煤泥 */
  slime: number;
}

export interface DispatchDailyTableCoalQualityInnerModel {
  /** 精煤灰分 */
  cleanCoalAsh: number;
  /** 精煤水分 */
  cleanCoalWater: number;
  /** 浮精灰分 */
  flotationCleanCoalAsh: number;
  /** 浮精水分 */
  flotationCleanCoalWater: number;
  /** 采样时间 */
  inspectionTime: string;
  /** 洗混煤灰分 */
  mixedCoalAsh: number;
  /** 洗混煤水分 */
  mixedCoalWater: number;
  /** 原煤灰分 */
  rawCoalAsh: number;
  /** 煤泥灰分 */
  slimeAsh: number;
  /** 矸石灰分 */
  stoneAsh: number;
}

export interface DispatchDailyTableClassCoalQualityInnerModel {
  /** 精煤班灰 */
  cleanCoalClassAsh: number;
  /** 精煤班水分 */
  cleanCoalClassWater: number;
  /** 浮精班灰 */
  flotationCleanCoalClassAsh: number;
  /** 洗混煤班灰 */
  mixedCoalClassAsh: number;
  /** 洗混煤班水 */
  mixedCoalClassWater: number;
  /** 原煤班灰 */
  rawCoalClassAsh: number;
  /** 煤泥班灰 */
  slimeClassAsh: number;
  /** 煤泥班水 */
  slimeClassWater: number;
  /** 矸石班灰 */
  stoneClassAsh: number;
}

export interface DispatchDailyThickenerDataInnerModel {
  /** 循环水浓度 */
  cirWaterConcentration: string;
  /** 601底流 */
  underflow601: string;
  /** 602底流 */
  underflow602: string;
  /** 603底流 */
  underflow603: string;
}

export interface DispatchDailyTableYieldInnerModel {
  /** 精煤 */
  cleanCoal: number;
  /** 浮选精煤 */
  flotationCleanCoal: number;
  /** 入洗原煤 */
  incomingWashCoal: number;
  /** 矿井提升 */
  mineHoisting: number;
  /** 洗混煤 */
  mixedCoal: number;
  /** 混煤入仓 */
  mixedCoalIn: number;
  /** 商品煤 */
  salableCoal: number;
  /** 煤泥 */
  slime: number;
}

export interface DispatchDailyTableModel {
  /** 影响及事故 */
  accident: DispatchDailyAccidentModel[];
  blank: {
    allDay: DispatchDailyTableYieldBlankInnerModel;
    day: DispatchDailyTableYieldBlankInnerModel;
    month: DispatchDailyTableYieldBlankInnerModel;
    night: DispatchDailyTableYieldBlankInnerModel;
    year: DispatchDailyTableYieldBlankInnerModel;
  };
  bunkerAuto: {
    day: DispatchDailyBunkerInnerModel;
    night: DispatchDailyBunkerInnerModel;
  };
  bunkerManual: {
    date: string;
    day: DispatchDailyBunkerInnerManualModel;
    night: DispatchDailyBunkerInnerManualModel;
  };
  /** 商品煤数质量 */
  commercialCoalInspection: DispatchDailyCommercialCoalInspectionModel[];
  deviceOperation: DispatchDailyDeviceOperationDataModel;
  energy: {
    allDay: DispatchDailyTableEnergyInnerModel;
    day: DispatchDailyTableEnergyInnerModel;
    month: DispatchDailyTableEnergyInnerModel;
    night: DispatchDailyTableEnergyInnerModel;
  };
  head: {
    /** 查询日期 */
    date: string;
    /** 白班 */
    dayDuty: string;
    /** 机电值班 */
    elecDuty: string;
    /** 厂值班 */
    factoryDuty: string;
    /** 生产保障车间值班 */
    guaranteeDuty: string;
    /** 夜班 */
    nightDuty: string;
    /** 生产车间值班 */
    productionDuty: string;
    /** 审核人 */
    reviewer: string;
    /** 报表名称 */
    title: string;
  };
  operationData: {
    allDay: { model: Record<string, Record<string, string>> };
    day: { model: Record<string, Record<string, string>> };
    effects: Record<string, Record<string, number>>;
    month: { model: Record<string, Record<string, string>> };
    night: { model: Record<string, Record<string, string>> };
  };
  productivity: {
    allDay: DispatchDailyTableProductivityInnerModel;
    day: DispatchDailyTableProductivityInnerModel;
    month: DispatchDailyTableProductivityInnerModel;
    night: DispatchDailyTableProductivityInnerModel;
    year: DispatchDailyTableProductivityInnerModel;
  };
  quality: {
    avgQuick: DispatchDailyTableCoalQualityInnerModel;
    dayClass: DispatchDailyTableClassCoalQualityInnerModel;
    nightClass: DispatchDailyTableClassCoalQualityInnerModel;
    quick: DispatchDailyTableCoalQualityInnerModel[];
  };
  thickener: {
    day: DispatchDailyThickenerDataInnerModel;
    night: DispatchDailyThickenerDataInnerModel;
  };
  yield: {
    allDay: DispatchDailyTableYieldInnerModel;
    day: DispatchDailyTableYieldInnerModel;
    month: DispatchDailyTableYieldInnerModel;
    night: DispatchDailyTableYieldInnerModel;
    year: DispatchDailyTableYieldInnerModel;
  };
}
