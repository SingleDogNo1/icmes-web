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

export const editOrgSchemas: FormSchema[] = [
  {
    field: 'code',
    label: '编号',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parentOrganization',
    label: '上级机构',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      showSearch: true,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'fullName',
      },
    },
  },
  {
    field: 'parentFullName',
    label: '父级机构全称',
    show: false,
    component: 'Input',
  },
  {
    field: 'parentId',
    label: '父级机构ID',
    show: false,
    component: 'Input',
  },
  {
    field: 'phone',
    label: '办公室电话',
    component: 'Input',
    componentProps: {
      maxlength: 11,
      onChange: (e: ChangeEvent) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
      },
    },
  },
  {
    field: 'versionTag',
    label: '数据版本',
    component: 'Input',
    show: false,
  },
];
