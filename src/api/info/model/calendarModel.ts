export interface GetCalendarStatisticsParam {
  /** 年份 */
  year: number;
}

export interface GetCalendarStatisticsResultModel {
  /** 当年的天数 */
  dayTotal: number;
  /** 每月统计信息 */
  items: CalendarStatisticsItemModel[];
  /** 年份 */
  year: number;
}

export interface CalendarStatisticsItemModel {
  dayDetails: {
    day: number;
    dayType: number;
    versionTag: string;
  }[];
  month: number;
  repairDayTotal: number;
  restDayTotal: number;
  workDayTotal: number;
}

export interface UpdateCalendarStatisticsParam {
  date: string;
  dayType: number;
  versionTag: string;
}

export interface UpdateCalendarStatisticsResultModel {
  code: number | string;
}
