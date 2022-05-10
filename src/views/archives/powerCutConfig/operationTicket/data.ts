import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { getMoreCriterionDevicesListApi } from '/@/api/info/devices';

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
    defaultValue: 'Number',
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
    componentProps: {
      style: { width: '300px' },
      placeholder: '操作票编号/操作票名称/设备编号',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '操作票编号',
    dataIndex: 'number',
  },
  {
    title: '操作票名称',
    dataIndex: 'name',
  },
  {
    title: '适用范围',
    dataIndex: 'range',
    slots: { customRender: 'range' },
  },
  {
    title: '启用/停用',
    dataIndex: 'flag',
    slots: { customRender: 'flag' },
  },
];

export const editTicketSchemas: FormSchema[] = [
  {
    field: 'number',
    label: '操作票编号',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '操作票名称',
    component: 'Input',
    required: true,
  },
];

export const editRangeSchemas: FormSchema[] = [
  {
    field: 'deviceIds',
    label: '设备',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      getPopupContainer: () => document.body,
      mode: 'multiple',
      optionFilterProp: 'label',
      showSearch: true,
      api: getMoreCriterionDevicesListApi,
      params: {
        organizationIds: [],
        pageSize: 0,
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
      onOptionsReady: (options) => {
        options.forEach((v) => {
          v.name = (v.processNo || v.code) + v.name;
        });
      },
    },
  },
];
