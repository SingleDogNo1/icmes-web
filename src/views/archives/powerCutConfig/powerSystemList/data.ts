import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
// import { getStrategyListApi } from '/@/api/info/strategy';

export const schemas: FormSchema[] = [
  {
    field: 'pageNo',
    label: '当前页',
    component: 'InputNumber',
    defaultValue: 1,
    show: false,
  },
  {
    field: 'pageSize',
    label: '每页条数',
    component: 'InputNumber',
    defaultValue: 10,
    show: false,
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设备/图片名称',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '图片名称',
    dataIndex: 'images',
    slots: { customRender: 'images' },
  },
  {
    title: '设备',
    dataIndex: 'deviceProcessNo',
    customRender: ({ record }) => {
      return `${record.deviceProcessNo} ${record.deviceName}`;
    },
  },
];

export const editSchemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Upload',
    label: '字段1',
    colProps: {
      span: 8,
    },
    rules: [{ required: true, message: '请选择上传文件' }],
    componentProps: {
      api: '/api/info/devices/photo',
      maxNumber: 1,
      accept: ['images/*'],
    },
  },
];
