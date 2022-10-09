export interface BasicPropsInterface {
  monFirst?: boolean;
  weeks?: string[];
  useSwipe?: boolean;
  begin?: string;
  end?: string;
  completion?: boolean;
  holidays?: Record<string, string>;
  customDays?: any;
  tileContent?: Record<string, any>;
  remarks?: Record<string, string>;
  selectMode?: 'select' | 'multi' | 'range' | 'multiRange';
  selectDate?: string | string[] | SelectRangeInterface | SelectRangeInterface[];
  disabled?: string[];
}

export interface CalendarInterface extends BasicPropsInterface {
  mode: 'monthRange' | 'week' | 'month';
  monthRange: string[];
  language?: 'en' | 'cn';
  format: (year: string, month: string) => string[];
  lunar?: boolean;
  className?: string;
}

export interface SwipeInterface {
  initialSlide?: number;
  auto?: number;
  speed: number;
  timetableHeight?: number;
  loop?: boolean;
  useSwipe?: boolean;
}

export interface SlideInterface {
  className?: string;
  useSwipe?: boolean;
}

export type startType = {
  x: number;
  y: number;
  time: number;
};

export type deltaType = {
  x: number;
  y: number;
};

export interface SelectRangeInterface {
  start: string;
  end: string;
}

export interface TimeTableInterface extends BasicPropsInterface {
  format?: (year: string | number, month: string | number) => any[];
  tableMode: 'month' | 'week' | 'monthRange';
  lunar?: Record<string, any>;
  tableIndex?: number;
  timestamp?: number;
  year?: string | number;
  month?: string | number;
  day?: string | number;
}
