import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';

import { useUserState } from '/@/hooks/web/useUserState';

const { getDictOptions } = useUserState();

// 业务类型
const businessTypeOptions = getDictOptions('STRATEGY_TYPE');

export const getStrategyEngineListSchemas: FormSchema[] = [
  {
    field: 'ascending',
    label: '升序',
    component: 'Checkbox',
    required: true,
    defaultValue: true,
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
    field: 'orderBy',
    label: '排序的字段名',
    component: 'Input',
    defaultValue: 'number',
    show: false,
  },
  {
    // inline 模式下，下拉框组件宽度随着选项宽度不确定。所以使用 slot 定义，可以固定宽度
    field: 'businessType',
    label: '',
    component: 'Select',
    slot: 'businessType',
  },
  {
    field: 'nameOrNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      maxLength: 20,
      placeholder: '输入关键字进行过滤',
    },
  },
];

export const strategyEngineListTableColumns: BasicColumn[] = [
  {
    title: '策略编号',
    dataIndex: 'number',
    fixed: 'left',
  },
  {
    title: '策略名称',
    dataIndex: 'name',
    width: 240,
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    slots: { customRender: 'businessType' },
  },
  {
    title: '启用/停用',
    dataIndex: 'isUse',
    slots: { customRender: 'isUse' },
  },
];

export const strategySymbolOptions = [
  {
    value: 'GREATER_THAN',
    label: '>',
  },
  {
    value: 'GREATER_THAN_OR_EQUAL',
    label: '>=',
  },
  {
    value: 'LESS_THAN',
    label: '<',
  },
  {
    value: 'LESS_THAN_OR_EQUAL',
    label: '<=',
  },
  {
    value: 'EQUAL',
    label: '=',
  },
  {
    value: 'NOT_EQUAL',
    label: '!=',
  },
];

export const editStrategyEngineSchemas: FormSchema[] = [
  {
    field: 'number',
    label: '策略编号',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '策略名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'businessType',
    label: '业务类型',
    component: 'Select',
    required: true,
    componentProps: {
      options: businessTypeOptions,
      placeholder: '请选择',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'remark',
    label: '描述',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 100,
      showCount: true,
      autosize: true,
    },
  },
  // -------- hidden field --------
  {
    field: 'versionTag',
    label: '用于高并发的数据版本控制',
    component: 'Input',
    show: false,
  },
  {
    field: 'dataType',
    label: '数据类型',
    component: 'Input',
    defaultValue: 'NUMBER',
    show: false,
  },
  {
    field: 'isUse',
    label: '是否启用',
    component: 'Switch',
    defaultValue: true,
    show: false,
  },
  {
    field: 'id',
    label: '标识符',
    component: 'Input',
    show: false,
  },
];
