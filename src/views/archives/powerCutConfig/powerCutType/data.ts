import { FormSchema } from '/@/components/Form';
import { useUserState } from '/@/hooks/web/useUserState';
import type { BasicColumn } from '/@/components/Table';

const { getDictOptions } = useUserState();
const workflowOptions = getDictOptions('DT_POWER_CUT_TYPE');

export const powerCutTypeColumns: BasicColumn[] = [
  { title: '名称', dataIndex: 'name', fixed: 'left' },
  {
    title: '类型',
    dataIndex: 'powerCutType',
    fixed: 'left',
    slots: { customRender: 'type' },
  },
  { title: '工作流编码', dataIndex: 'workFlowCode' },
  { title: '使用部门', dataIndex: 'departmentList' },
  { title: '备注', dataIndex: 'remark' },
  { title: '启用/停用', dataIndex: 'useful', slots: { customRender: 'useful' } },
];

export const editPowerCutConfigSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 15,
      disabled: true,
    },
  },
  {
    field: 'powerCutType',
    label: '类型',
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        {
          value: 1,
          label: '高压停送电',
        },
        {
          value: 2,
          label: '低压停送电',
        },
        {
          value: 3,
          label: '特殊停送电',
        },
      ],
    },
  },
  {
    field: 'workFlowCode',
    label: '工作流编码',
    component: 'Select',
    required: true,
    componentProps: {
      options: workflowOptions,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'organizationIds',
    label: '使用部门',
    component: 'TreeSelect',
    componentProps: {
      showSearch: true,
      treeCheckable: true,
      showCheckedStrategy: 'SHOW_ALL',
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'configId',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
  },
];
