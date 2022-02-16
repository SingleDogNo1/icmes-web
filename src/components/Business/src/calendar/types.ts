export interface CalendarInterface {
  monFirst?: boolean;
  completion?: boolean;
  useSwipe?: boolean;
  weeks?: string[];
  className?: string;
  language?: 'en' | 'cn';
  holidays: { [key: string]: string };
  tileContent: { [key: string]: any };
  remarks: { [key: string]: any };
  disabled: string[];
  begin: string;
  end: string;
  monthRange: string[];
  mode: 'monthRange' | 'week' | 'month';
  selectMode: 'select' | 'multi' | 'range' | 'multiRange';
  lunar?: any;
  selectDate?: any;
  format: (year: string, month: string) => string[];
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

export interface TimeTableInterface {
  monFirst?: boolean;
  format?: (year: string | number, month: string | number) => any[];
  weeks: string[];
  tableMode: 'month' | 'week' | 'monthRange';
  lunar?: any;
  useSwipe: boolean;
  tableIndex?: number;
  timestamp?: number;
  year?: string | number;
  month?: string | number;
  day?: string | number;
  begin?: string;
  end?: string;
  completion: boolean;
  holidays?: { [key: string]: string };
  // tileContent: { className?: string; tileContent?: string }[] | { [key: string]: any };
  tileContent?: any;
  remarks: { [key: string]: string };
  selectMode: 'select' | 'multi' | 'range' | 'multiRange';
  selectDate?:
    | string
    | string[]
    | { start?: string; end?: string }
    | { start?: string; end?: string }[];
  disabled: string[];
}
