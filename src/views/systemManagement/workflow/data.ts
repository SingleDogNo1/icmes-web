import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { workflowNodeTypeEnum, nodeTypeEnum } from '/@/enums/workflowEnum';
import { useUserState } from '/@/hooks/web/useUserState';
import { nextTick } from 'vue';

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

export const reminderTableColumns: BasicColumn[] = [
  {
    title: '通知时间节点',
    dataIndex: 'notificationPhase',
    slots: { customRender: 'notificationPhase' },
  },
  {
    title: '通知类型',
    dataIndex: 'type',
    slots: { customRender: 'type' },
  },
  {
    title: '通知对象类型',
    dataIndex: 'notificationObjectType',
    slots: { customRender: 'notificationObjectType' },
  },
  {
    title: '通知对象',
    dataIndex: 'jsonParseObjectInfo',
  },
  {
    title: '按班次通知',
    dataIndex: 'isWorkingShiftNoticeOn',
    slots: { customRender: 'isWorkingShiftNoticeOn' },
  },
];

export const reportTableColumns: BasicColumn[] = [
  {
    title: '超时时长/分钟',
    dataIndex: 'timeoutPeriod',
  },
  {
    title: '上报对象类型',
    dataIndex: 'reportingObjectType',
    slots: { customRender: 'type' },
  },
  {
    title: '上报对象',
    dataIndex: 'jsonParseObjectInfo',
  },
  {
    title: '按班次通知',
    dataIndex: 'isWorkingShiftNoticeOn',
    slots: { customRender: 'isWorkingShiftNoticeOn' },
  },
];

export const editWorkflowNodeSchemas = (editType): FormSchema[] => {
  return [
    {
      field: 'order',
      label: '步骤序号',
      component: 'InputNumber',
      required: true,
      componentProps: {
        max: 99,
      },
    },
    {
      field: 'isSystemAutoExec',
      label: '系统自动执行',
      component: 'Checkbox',
      defaultValue: false,
      colProps: { span: 12 },
    },
    {
      field: 'isImmediatelyExecute',
      label: '即时业务流转',
      component: 'Checkbox',
      defaultValue: true,
      colProps: { span: 12 },
    },
    {
      field: 'code',
      label: '节点编码',
      component: 'Input',
      required: true,
      componentProps: {
        max: 30,
      },
    },
    {
      field: 'name',
      label: '节点名称',
      component: 'Input',
      required: true,
      componentProps: {
        max: 20,
      },
    },
    {
      field: 'method',
      label: '操作方式',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { label: '会签', value: workflowNodeTypeEnum.ADD },
          { label: '或签', value: workflowNodeTypeEnum.OR },
        ],
      },
    },
    {
      field: 'numberOfSigned',
      label: '或签人数',
      component: 'InputNumber',
      // 操作方式为或签 & 工作类型不为审批， 才显示出来
      show: ({ values }) =>
        values.method === workflowNodeTypeEnum.OR && values.type !== nodeTypeEnum.APPROVE,
      required: ({ values }) =>
        values.method === workflowNodeTypeEnum.OR && values.type !== nodeTypeEnum.APPROVE,
      defaultValue: 1,
      componentProps: {
        maxlength: 30,
      },
    },
    {
      field: 'type',
      label: '工作类型',
      component: 'Select',
      required: true,
      componentProps: ({ formActionType, formModel }) => {
        return {
          disabled: editType.value === 'edit',
          options: [
            { label: '操作', value: nodeTypeEnum.OPERATION },
            { label: '审批', value: nodeTypeEnum.APPROVE },
          ],
          onChange: async () => {
            await nextTick();
            const { updateSchema } = formActionType;
            updateSchema([
              {
                field: 'operateSuccessStatus',
                label: formModel.type === nodeTypeEnum.APPROVE ? '审批通过状态' : '操作完成状态',
              },
            ]);
          },
        };
      },
    },
    {
      field: 'operateSuccessStatus',
      label: '操作完成状态',
      component: 'Select',
      required: true,
      componentProps: {
        options: [],
      },
    },
    {
      field: 'operateFailureStatus',
      label: '审批驳回状态',
      component: 'Select',
      show: ({ values }) => values.type === nodeTypeEnum.APPROVE,
      required: ({ values }) => values.type === nodeTypeEnum.APPROVE,
      componentProps: {
        options: [],
      },
    },
    {
      field: 'redirectToNodeId',
      label: '驳回后返回节点',
      component: 'Select',
      show: ({ values }) => values.type === nodeTypeEnum.APPROVE,
      required: ({ values }) => values.type === nodeTypeEnum.APPROVE,
      componentProps: {
        options: [],
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
    },
    // --------- hidden fields ---------
    {
      field: 'formKey',
      label: '',
      component: 'Input',
      show: false,
      defaultValue: '',
    },
    {
      field: 'versionTag',
      label: '',
      component: 'Input',
      show: false,
    },
  ];
};
