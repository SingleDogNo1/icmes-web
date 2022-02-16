import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';

// 带电类型下拉框
const powerTypeOptions = [
  {
    value: 5,
    label: '远程高压设备',
  },
  {
    value: 6,
    label: '远程低压设备',
  },
  {
    value: 7,
    label: '远程非常规设备',
  },
  {
    value: 1,
    label: '停送电高压设备',
  },
  {
    value: 2,
    label: '停送电低压设备',
  },
  {
    value: 4,
    label: '非常规设备',
  },
  {
    value: 3,
    label: '不参与停送电设备',
  },
  {
    value: -1,
    label: '未知',
  },
];

// PLC监测类型下拉框
const plcDetectTypeOptions = [
  {
    value: 0,
    label: '不检测状态信号',
  },
  {
    value: 1,
    label: '只监测运行状态',
  },
  {
    value: 2,
    label: '只监测带电状态',
  },
  {
    value: 4,
    label: '只监测就地状态',
  },
  {
    value: 3,
    label: '监测运行状态+带电状态',
  },
  {
    value: 8,
    label: '监测就地状态+运行状态',
  },
  {
    value: 9,
    label: '监测就地状态+带电状态',
  },
  {
    value: 7,
    label: '监测运行状态+带电状态+就地状态',
  },
  {
    value: 5,
    label: '参与停送电流程，无电工配电操作',
  },
  {
    value: 6,
    label: '不参与停送电流程',
  },
  {
    value: -1,
    label: '未知',
  },
];
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
    field: 'category',
    label: '设别标识符集合',
    component: 'Select',
    required: true,
    defaultValue: [],
    show: false,
  },
  {
    field: 'needTree',
    label: '是否按照设备类型分类返回一棵假树',
    component: 'Checkbox',
    required: true,
    defaultValue: false,
    show: false,
  },
  {
    field: 'orderBy',
    label: '排序字段',
    component: 'Input',
    required: true,
    defaultValue: 'processNo',
    show: false,
  },
  {
    field: 'organizationIds',
    label: '权限组织id集合',
    component: 'Select',
    required: true,
    defaultValue: [],
    show: false,
  },
  {
    field: 'pageNo',
    label: '当前页',
    component: 'InputNumber',
    required: true,
    defaultValue: 1,
    show: false,
  },
  {
    field: 'pageSize',
    label: '每页条数',
    component: 'InputNumber',
    required: true,
    defaultValue: 10,
    show: false,
  },
  {
    field: 'parentId',
    label: '所属父级设备标识符',
    component: 'InputNumber',
    required: true,
    defaultValue: 0,
    show: false,
  },
  {
    field: 'powerType',
    label: '带电类型',
    component: 'Select',
    componentProps: {
      style: { width: '200px' },
      options: powerTypeOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'plcDetectType',
    label: 'PLC监测类型',
    component: 'Select',
    componentProps: {
      style: { width: '200px' },
      options: plcDetectTypeOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      style: { width: '200px' },
      maxlength: 20,
      placeholder: '输入关键字进行过滤',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '设备',
    dataIndex: 'processNo',
    customRender: ({ record }) => {
      return `${record.processNo} ${record.name} ${record.code}`;
    },
  },
  {
    title: '带电类型',
    dataIndex: 'powerType',
    customRender: ({ record }) => {
      const item = powerTypeOptions.find((val) => val.value === record.powerType);
      return item?.label;
    },
  },
  {
    title: 'PLC监测类型',
    dataIndex: 'plcDetectType',
    customRender: ({ record }) => {
      const item = plcDetectTypeOptions.find((val) => val.value === record.plcDetectType);
      return item?.label;
    },
  },
];
