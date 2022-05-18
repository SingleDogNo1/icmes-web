import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { useUserState } from '/@/hooks/web/useUserState';

const { getDictOptions } = useUserState();

const partnerTypeOptions = getDictOptions('DT_PARTNER_TYPE');

export const searchVendorSchemas: FormSchema[] = [
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
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      style: { width: '150px' },
      options: partnerTypeOptions,
    },
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      maxlength: 20,
      placeholder: '编号/名称/地址/联系人',
    },
  },
];

export const columns: BasicColumn[] = [
  { title: '编号', dataIndex: 'code', fixed: 'left' },
  { title: '名称', dataIndex: 'name' },
  { title: '类型', dataIndex: 'type', slots: { customRender: 'type' } },
  { title: '地址', dataIndex: 'address' },
  { title: '联系方式', dataIndex: 'contact', slots: { customRender: 'contact' } },
  {
    title: '客户名称(接口设置)',
    dataIndex: 'interfaceCustomer',
    slots: { customRender: 'interface' },
  },
];

export const editVendorSchemas: FormSchema[] = [
  {
    field: 'code',
    label: '编号',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    required: true,
    componentProps: {
      options: partnerTypeOptions,
    },
  },
  {
    field: 'address',
    label: '地址',
    component: 'Input',
    componentProps: {
      maxlength: 40,
    },
  },
  {
    field: 'contactField',
    component: 'Input',
    label: '联系人',
    slot: 'contactField',
  },
  {
    field: 'contactName1',
    component: 'Input',
    label: '联系人1',
    defaultValue: '',
    show: false,
  },
  {
    field: 'contactPhone1',
    component: 'Input',
    label: '联系人1',
    defaultValue: '',
    show: false,
  },
  {
    field: 'contactName2',
    component: 'Input',
    label: '联系人2',
    defaultValue: '',
    show: false,
  },
  {
    field: 'contactPhone2',
    component: 'Input',
    label: '联系人2',
    defaultValue: '',
    show: false,
  },
  {
    field: 'contactName3',
    component: 'Input',
    label: '联系人3',
    defaultValue: '',
    show: false,
  },
  {
    field: 'contactPhone3',
    component: 'Input',
    label: '联系人3',
    defaultValue: '',
    show: false,
  },

  {
    field: 'interfaceCustomer',
    component: 'Select',
    label: '接口设置',
  },
  {
    field: 'versionTag',
    component: 'Input',
    label: '用于高并发的数据版本控制',
    show: false,
  },
];
