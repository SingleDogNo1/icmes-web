import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';

export const columns: BasicColumn[] = [
  { title: '编号', dataIndex: 'code', fixed: 'left' },
  { title: '名称', dataIndex: 'name' },
  { title: '全称', dataIndex: 'fullName' },
];

export const schemas: FormSchema[] = [
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
    label: '全称',
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
    field: 'parentId',
    label: '父级机构ID',
    show: false,
    component: 'Input',
  },
  {
    field: 'versionTag',
    label: '数据版本',
    component: 'Input',
    show: false,
  },
];
