import type { PropType } from 'vue';
import { FileBasicColumn } from './typing';
import type { BasicColumn } from '/@/components/Table';

export const basicProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  helpText: {
    type: String as PropType<string>,
    default: '',
  },
  // 文件最大多少MB
  maxSize: {
    type: Number as PropType<number>,
    default: 2,
  },
  // 最大数量的文件，Infinity不限制
  maxNumber: {
    type: Number as PropType<number>,
    default: Infinity,
  },
  // 根据后缀，或者其他
  accept: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  uploadParams: {
    type: Object as PropType<any>,
    default: {},
  },
  api: {
    type: Function as PropType<PromiseFn>,
    default: null,
    required: true,
  },
  name: {
    type: String as PropType<string>,
    default: 'file',
  },
  filename: {
    type: String as PropType<string>,
    default: null,
  },
  imageSize: {
    type: Object as PropType<{
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
    }>,
    default: null,
  },
};

export const uploadContainerProps = {
  value: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  ...basicProps,
  showPreviewNumber: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  emptyHidePreview: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  previewTableColumns: {
    type: Array as PropType<BasicColumn[] | null>,
    default: null,
  },
};

export const previewProps = {
  value: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  previewTableColumns: {
    type: Array as PropType<BasicColumn[] | null>,
    default: null,
  },
};

export const fileListProps = {
  columns: {
    type: [Array] as PropType<FileBasicColumn[]>,
    default: null,
  },
  actionColumn: {
    type: Object as PropType<FileBasicColumn>,
    default: null,
  },
  dataSource: {
    type: Array as PropType<any[]>,
    default: null,
  },
};
