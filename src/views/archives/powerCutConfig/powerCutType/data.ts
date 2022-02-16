import { FormSchema } from '/@/components/Form';
import { useUserState } from '/@/hooks/web/useUserState';
// import { isIDCardNumber, isMobilePhone, isEmail } from '/@/utils/is';
// import { dateUtil } from '/@/utils/dateUtil';
import type { BasicColumn } from '/@/components/Table';

const { getDictByType } = useUserState();
const workflowTypes = getDictByType('DT_POWER_CUT_TYPE').options;
const workflowOptions: any[] = [];
for (const key in workflowTypes) {
  const obj = { value: key, label: key };
  workflowOptions.push(obj);
}

export const tabsList = [
  {
    key: '1',
    name: '停送电类型',
    component: 'PowerCutType',
  },
  {
    key: '2',
    name: '设备带电类型',
    component: 'DeviceChargedType',
  },
  {
    key: '3',
    name: 'PLC判断规则',
    component: 'PLCJudgmentRule',
  },
  {
    key: '4',
    name: '安全技术措施',
    component: 'SafetyTechnology',
  },
  {
    key: '5',
    name: '高压操作票',
    component: 'OperationTicket',
  },
  {
    key: '6',
    name: '供电系统图',
    component: 'PowerSystemList',
  },
  {
    key: '7',
    name: '验证配置',
    component: 'ElectricianSetting',
  },
  {
    key: '8',
    name: '异常消息',
    component: 'ErrorMessage',
  },
];

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
      replaceFields: {
        title: 'name',
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
