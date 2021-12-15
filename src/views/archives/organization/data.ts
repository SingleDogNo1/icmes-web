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
    defaultValue: 'Code',
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
    field: 'parentId',
    label: '',
    component: 'Input',
    defaultValue: 0,
    show: false,
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      maxlength: 20,
      placeholder: '编码/名称',
    },
  },
];

export const columns: BasicColumn[] = [
  { title: '编号', dataIndex: 'code', fixed: 'left' },
  { title: '名称', dataIndex: 'name' },
  { title: '全称', dataIndex: 'fullName' },
  { title: '办公室电话', dataIndex: 'phone' },
];
