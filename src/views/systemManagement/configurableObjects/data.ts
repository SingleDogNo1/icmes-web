import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';

export const schemas: FormSchema[] = [
  {
    field: 'ascending',
    label: '升序',
    component: 'Checkbox',
    required: true,
    defaultValue: true,
    show: false,
  },
  {
    field: 'orderBy',
    label: '排序字段',
    component: 'Input',
    defaultValue: '',
    show: false,
  },
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
    defaultValue: '',
    componentProps: {
      maxlength: 20,
      placeholder: '名称/设备编号/编号',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'code',
  },
  {
    title: '工艺系统',
    dataIndex: 'processName',
  },
  {
    title: '设备编号',
    dataIndex: 'processNo',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
];
