import { PropType } from 'vue';
import { SelectRangeInterface } from './types';

export const basicCalendarProps = {
  selectMode: {
    type: String as PropType<'select' | 'multi' | 'range' | 'multiRange'>,
    default: 'select',
  },
  mode: {
    type: String as PropType<'monthRange' | 'week' | 'month'>,
    default: 'month',
  },
  selectDate: {
    type: [String, Array, Object] as PropType<
      string | string[] | SelectRangeInterface[] | SelectRangeInterface
    >,
  },
  monthRange: {
    type: Array as PropType<string[]>,
    default: null,
  },
  remarks: {
    type: Object as PropType<Record<string, string>>,
    default() {
      return {};
    },
  },
  tileContent: {
    type: Object as PropType<Record<string, Record<string, string>>>,
    default() {
      return {};
    },
  },
  holidays: {
    type: Object as PropType<Record<string, string>>,
    default() {
      return {};
    },
  },
  completion: {
    type: Boolean,
    default: true,
  },
  useSwipe: {
    type: Boolean,
    default: true,
  },
  monFirst: {
    type: Boolean,
    default: false,
  },
  backgroundText: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String as PropType<'en' | 'cn'>,
    default: 'cn',
  },
  format: {
    type: Function as PropType<(year: string, month: string) => string[]>,
    default: null,
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
  disabled: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  lunar: {
    type: Boolean,
    default: true,
  },
  customDays: {
    type: Object,
    default: null,
  },
  className: {
    type: String,
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
  monFirst: {
    type: Boolean,
    default: true,
  },
  format: {
    type: Function as PropType<(year: string | number, month: string | number) => any[]>,
  },
  weeks: {
    type: Array as PropType<string[]>,
    default: null,
  },
  tableMode: {
    type: String as PropType<'month' | 'week' | 'monthRange'>,
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
  customDays: {
    type: Object,
    default: null,
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
    type: String as PropType<'select' | 'multi' | 'range' | 'multiRange'>,
    default: null,
  },
  disabled: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  selectDate: {
    type: [String, Array, Object] as PropType<
      string | string[] | SelectRangeInterface[] | SelectRangeInterface
    >,
  },
};
