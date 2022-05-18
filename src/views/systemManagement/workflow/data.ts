import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';

import { useUserState } from '/@/hooks/web/useUserState';

const { getDictOptions } = useUserState();

// 业务类型
const businessTypeOptions = getDictOptions('DT_BUSINESS_TYPE');

export const getWorkflowsListSchemas: FormSchema[] = [
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
    // inline 模式下，下拉框组件宽度随着选项宽度不确定。所以使用 slot 定义，可以固定宽度
    field: 'businessType',
    label: '业务类型',
    component: 'Select',
    defaultValue: '',
    slot: 'businessType',
  },
  {
    field: 'codeOrName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '工作流编号/名称',
    },
  },
];

export const workflowListTableColumns: BasicColumn[] = [
  {
    title: '工作流编号',
    dataIndex: 'code',
    fixed: 'left',
  },
  {
    title: '工作流名称',
    dataIndex: 'name',
    width: 125,
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    slots: { customRender: 'businessType' },
  },
  {
    title: '状态',
    dataIndex: 'isDeploy',
    slots: { customRender: 'isDeploy' },
  },
];

export const editWorkflowSchemas: FormSchema[] = [
  {
    field: 'code',
    label: '工作流编号',
    component: 'Input',
    defaultValue: '',
    colProps: { span: 24 },
    rules: [
      {
        validator: (_, value) => {
          if (!value) {
            return Promise.reject('请输入工作流编号');
          } else if (/[^\w_]/g.test(value)) {
            return Promise.reject('编码只能输入数字字母下划线');
          } else if (/[0-9]/.test(value.charAt(0))) {
            return Promise.reject('编码第一位不可以是数字');
          } else {
            return Promise.resolve();
          }
        },
        trigger: ['change', 'blur'],
      },
    ],
  },
  {
    field: 'name',
    label: '工作流名称',
    component: 'Input',
    defaultValue: '',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'businessType',
    label: '业务类型',
    component: 'Select',
    required: true,
    componentProps: {
      options: businessTypeOptions,
      placeholder: '请选择',
    },
  },
  {
    field: 'versionTag',
    label: '用于高并发的数据版本控制',
    component: 'Input',
    required: false,
    show: false,
  },
];

export const workflowNodeTableColumns: BasicColumn[] = [
  {
    title: '步骤',
    dataIndex: 'order',
    fixed: 'left',
  },
  {
    title: '节点名称',
    dataIndex: 'name',
    width: 125,
  },
  {
    title: '工作类型',
    dataIndex: 'workType',
    slots: { customRender: 'workType' },
  },
  {
    title: '启用/停用',
    dataIndex: 'isDisabled',
    slots: { customRender: 'nodeState' },
  },
];
