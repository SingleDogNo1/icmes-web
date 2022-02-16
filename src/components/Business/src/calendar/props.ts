import { PropType } from 'vue';
import { TimeTableInterface, CalendarInterface } from './types';

export const basicCalendarProps = {
  format: {
    type: Function as PropType<CalendarInterface['format']>,
    default: null,
  },
  holidays: {
    type: Object,
    default() {
      return {};
    },
  },
  lunar: {
    type: Object,
  },
  remarks: {
    type: Object,
    default() {
      return {};
    },
  },
  monthRange: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  tileContent: {
    type: Object,
    default() {
      return {};
    },
  },
  completion: {
    type: Boolean,
    default: false,
  },
  useSwipe: {
    type: Boolean,
    default: true,
  },
  backgroundText: {
    type: Boolean,
  },
  monFirst: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
  },
  mode: {
    type: String as PropType<CalendarInterface['mode']>,
    validator: (v: any) => ['month', 'week', 'monthRange'].includes(v),
    default: 'month',
  },
  weeks: {
    type: Array as PropType<string[]>,
    default: null,
  },
  begin: {
    type: String,
    default: null,
  },
  end: {
    type: String,
    default: null,
  },
  selectMode: {
    type: String as PropType<CalendarInterface['selectMode']>,
    validator: (v: any) => ['select', 'multi', 'range', 'multiRange'].includes(v),
    default: 'select',
  },
  language: {
    type: String as PropType<'en' | 'cn'>,
    default: 'cn',
  },
  selectDate: {
    type: [String, Array, Object],
  },
  disabled: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
};

export const basicSwipeProps = {
  initialSlide: {
    type: Number,
    default: 0,
  },
  auto: {
    type: Number,
    default: 3000,
  },
  speed: {
    type: Number,
    default: 300,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  useSwipe: {
    type: Boolean,
  },
};

export const basicTableProps = {
  format: {
    type: Function as PropType<TimeTableInterface['format']>,
  },
  weeks: {
    type: Array as PropType<string[]>,
    default: null,
  },
  tableMode: {
    type: String as PropType<TimeTableInterface['tableMode']>,
    validator: (v: any) => ['month', 'week', 'monthRange'].includes(v),
    default: 'month',
  },
  language: {
    type: String as PropType<'en' | 'cn'>,
    default: 'cn',
  },
  year: {
    type: [String, Number],
  },
  month: {
    type: [String, Number],
  },
  day: {
    type: [String, Number],
  },
  lunar: {
    type: Object,
  },
  monFirst: {
    type: Boolean,
    default: true,
  },
  useSwipe: {
    type: Boolean,
    default: true,
  },
  backgroundText: {
    type: Boolean,
    default: true,
  },
  tableIndex: {
    type: Number,
  },
  begin: {
    type: String,
  },
  end: {
    type: String,
  },
  completion: {
    type: Boolean,
    default: false,
  },
  holidays: {
    type: Object,
    default() {
      return {};
    },
  },
  tileContent: {
    type: Object,
    default() {
      return {};
    },
  },
  remarks: {
    type: Object,
    default() {
      return {};
    },
  },
  timestamp: {
    type: Number,
  },
  selectMode: {
    type: String as PropType<TimeTableInterface['selectMode']>,
    validator: (v: any) => ['select', 'multi', 'range', 'multiRange'].includes(v),
    default: null,
  },
  disabled: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  selectDate: {
    type: [String, Array, Object] as PropType<TimeTableInterface['selectDate']>,
    default: null,
  },
};
