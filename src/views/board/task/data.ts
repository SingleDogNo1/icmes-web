import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
export const approvalSchemas: FormSchema[] = [
  {
    field: 'status',
    label: ' 状态',
    component: 'Select',
    defaultValue: 0,
    componentProps: {
      style: { width: '120px' },
      allowClear: false,
      options: [
        {
          label: '待审批',
          value: 0,
        },
        {
          label: '已审批',
          value: 1,
        },
        {
          label: '已关闭',
          value: 2,
        },
      ],
    },
  },
  {
    field: 'ascending',
    label: '顺序号',
    component: 'Input',
    defaultValue: false,
    show: false,
  },
  {
    field: 'orderBy',
    label: '排序字段',
    component: 'Input',
    defaultValue: '',
    show: false,
  },
  {
    field: 'pageNo',
    label: '当前页',
    component: 'Input',
    defaultValue: 1,
    show: false,
  },
  {
    field: 'pageSize',
    label: '每页条数',
    component: 'Input',
    defaultValue: 10,
    show: false,
  },
];

export const approvalTableColumns: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'code',
    fixed: 'left',
    slots: { customRender: 'code' },
  },
  {
    title: '单据类型',
    dataIndex: 'businessType',
    sorter: true,
    slots: { customRender: 'businessType' },
  },
  {
    title: '任务内容',
    dataIndex: 'content',
    slots: { customRender: 'content' },
  },
  {
    title: '任务时间',
    dataIndex: 'updateTime',
    sorter: true,
    slots: { customRender: 'updateTime' },
  },
  {
    title: '单据状态',
    dataIndex: 'approvalStatus',
    sorter: true,
    slots: { customRender: 'approvalStatus' },
  },
];

export const taskSchemas: FormSchema[] = [
  {
    field: 'status',
    label: ' 状态',
    component: 'Select',
    defaultValue: 0,
    componentProps: {
      style: { width: '120px' },
      allowClear: false,
      options: [
        {
          label: '待执行',
          value: 0,
        },
        {
          label: '已执行',
          value: 1,
        },
        {
          label: '已关闭',
          value: 2,
        },
      ],
    },
  },
  {
    field: 'ascending',
    label: '顺序号',
    component: 'Input',
    defaultValue: false,
    show: false,
  },
  {
    field: 'orderBy',
    label: '排序字段',
    component: 'Input',
    defaultValue: '',
    show: false,
  },
  {
    field: 'pageNo',
    label: '当前页',
    component: 'Input',
    defaultValue: 1,
    show: false,
  },
  {
    field: 'pageSize',
    label: '每页条数',
    component: 'Input',
    defaultValue: 10,
    show: false,
  },
];

export const taskTableColumns: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'code',
    fixed: 'left',
    slots: { customRender: 'code' },
  },
  {
    title: '单据类型',
    dataIndex: 'businessType',
    sorter: true,
    slots: { customRender: 'businessType' },
  },
  {
    title: '任务内容',
    dataIndex: 'content',
    slots: { customRender: 'content' },
  },
  {
    title: '任务时间',
    dataIndex: 'updateTime',
    sorter: true,
    slots: { customRender: 'updateTime' },
  },
  {
    title: '单据状态',
    dataIndex: 'approvalStatus',
    sorter: true,
    slots: { customRender: 'approvalStatus' },
  },
];
