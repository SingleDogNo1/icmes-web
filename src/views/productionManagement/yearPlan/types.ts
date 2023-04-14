import { ProductionYearPlanMonthFullModel } from '/@/api/production/model/yearPlanModel';

export interface MonthDetailData {
  year: string; // 接口返回当前年份的数字(2023)，需要转换成 YYYY-MM-DD HH:mm:ss 以供 antd 正常解析
  memo: ProductionYearPlanMonthFullModel['memo'];
  monthProductions: ProductionYearPlanMonthFullModel['monthProductions'];
}
