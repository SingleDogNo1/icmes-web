import { Layout } from './typing';

export const layoutProps = {
  autoSize: {
    type: Boolean,
    default: true,
  },
  colNum: {
    type: Number,
    default: 12,
  },
  rowHeight: {
    type: Number,
    default: 150,
  },
  maxRows: {
    type: Number,
    default: Infinity,
  },
  margin: {
    type: Array as PropType<number[]>,
    default: () => [10, 10],
  },
  isDraggable: {
    type: Boolean,
    default: true,
  },
  isResizable: {
    type: Boolean,
    default: true,
  },
  isMirrored: {
    type: Boolean,
    default: false,
  },
  useCssTransforms: {
    type: Boolean,
    default: true,
  },
  verticalCompact: {
    type: Boolean,
    default: true,
  },
  layout: {
    type: Array as PropType<Layout>,
    required: true,
  },
  responsive: {
    type: Boolean,
    default: false,
  },
  responsiveLayouts: {
    type: Object,
    default: () => {
      return {};
    },
  },
  breakpoints: {
    type: Object,
    default: () => {
      return { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    },
  },
  cols: {
    type: Object,
    default: () => {
      return { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
    },
  },
  preventCollision: {
    type: Boolean,
    default: false,
  },
};

export const itemProps = {
  isDraggable: {
    type: Boolean,
    required: false,
    default: null,
  },
  isResizable: {
    type: Boolean,
    required: false,
    default: null,
  },
  static: {
    type: Boolean,
    required: false,
    default: false,
  },
  minH: {
    type: Number,
    required: false,
    default: 1,
  },
  minW: {
    type: Number,
    required: false,
    default: 1,
  },
  maxH: {
    type: Number,
    required: false,
    default: Infinity,
  },
  maxW: {
    type: Number,
    required: false,
    default: Infinity,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  w: {
    type: Number,
    required: true,
  },
  h: {
    type: Number,
    required: true,
  },
  i: {
    type: [Number, String],
    required: true,
  },
  dragIgnoreFrom: {
    type: String,
    required: false,
    default: 'a, button',
  },
  dragAllowFrom: {
    type: String,
    required: false,
    default: null,
  },
  resizeIgnoreFrom: {
    type: String,
    required: false,
    default: 'a, button',
  },
};
