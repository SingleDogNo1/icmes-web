import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { useUserState } from '/@/hooks/web/useUserState';
import { AlarmStatusEnum } from '/@/api/info/model/alarmModel';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { formatToDateTime } from '/@/utils/dateUtil';

const { getDictOptions } = useUserState();
const userStore = useUserStoreWithOut();
const userId = userStore.getUserInfo.userId;

// 报警来源
const warningSourceOptions = getDictOptions('DT_ALARM_SOURCE');
warningSourceOptions.unshift({ label: '全部', value: '' });

// 报警类别
const warningKindOptions = getDictOptions('DT_ALARM_KIND');
warningKindOptions.unshift({ label: '全部', value: '' });

// 报警级别
const warningLevelOptions = getDictOptions('DT_ALARM_LEVEL');
warningLevelOptions.unshift({ label: '全部', value: '' });

export const schemas: FormSchema[] = [
  {
    component: 'Checkbox',
    label: '升序',
    field: 'ascending',
    required: true,
    defaultValue: false,
    show: false,
  },
  {
    component: 'Input',
    label: '排序字段',
    field: 'orderBy',
    required: true,
    defaultValue: 'startTime',
    show: false,
  },
  {
    component: 'Input',
    label: '报警对象或报警内容',
    labelWidth: 150,
    field: 'globalName',
    colProps: { span: 6 },
    componentProps: {
      maxlength: 20,
      placeholder: '设备编号/对象名称',
    },
  },
  {
    component: 'Select',
    label: '报警来源',
    field: 'warningSource',
    defaultValue: '',
    colProps: { span: 4 },
    componentProps: {
      options: warningSourceOptions,
    },
  },
  {
    component: 'Select',
    label: '报警类别',
    field: 'kind',
    defaultValue: '',
    colProps: { span: 4 },
    componentProps: {
      options: warningKindOptions,
    },
  },
  {
    component: 'Select',
    label: '报警级别',
    field: 'level',
    defaultValue: '',
    colProps: { span: 4 },
    componentProps: {
      options: warningLevelOptions,
    },
  },
  {
    component: 'Select',
    label: '处理状态',
    field: 'status',
    defaultValue: 1,
    colProps: { span: 4 },
    componentProps: {
      options: [
        { value: '', label: '全部' },
        { value: 1, label: '待处理' },
        { value: 2, label: '已处理' },
        { value: 3, label: '已报修' },
        { value: 4, label: '已关闭' },
      ],
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '报警对象',
    dataIndex: 'relativeObjectName',
    fixed: 'left',
  },
  {
    title: '报警内容',
    dataIndex: 'alarmContent',
  },
  {
    title: '报警来源',
    dataIndex: 'warningSource',
    slots: { customRender: 'warningSource' },
  },
  {
    title: '报警级别',
    dataIndex: 'level',
    slots: { customRender: 'level' },
  },
  {
    title: '报警开始时间',
    sorter: true,
    dataIndex: 'startTime',
    slots: { customRender: 'startTime' },
  },
  {
    title: '报警结束时间',
    sorter: true,
    dataIndex: 'endTime',
    slots: { customRender: 'endTime' },
  },
  {
    title: '报警持续时长',
    dataIndex: 'durationTime',
    slots: { customRender: 'durationTime' },
  },
  {
    title: '处理状态',
    dataIndex: 'optionStatus',
    slots: { customRender: 'optionStatus' },
  },
];

export const processForm: FormSchema[] = [
  {
    component: 'Input',
    label: 'ID',
    field: 'id',
    show: false,
  },
  {
    component: 'Input',
    label: '版本控制',
    field: 'versionTag',
    show: false,
  },
  {
    field: 'optionStatus',
    component: 'RadioGroup',
    label: '处理方式',
    labelWidth: 80,
    required: true,
    componentProps: {
      options: [
        {
          label: '处理完毕',
          value: AlarmStatusEnum['DONE'],
        },
        {
          label: '关闭',
          value: AlarmStatusEnum['CLOSED'],
        },
      ],
    },
  },
  {
    component: 'InputTextArea',
    label: '处理意见',
    labelWidth: 80,
    field: 'handlingDesc',
    defaultValue: '',
  },
];

export const modalTableColumns: BasicColumn[] = [
  {
    title: '报警对象',
    dataIndex: 'relativeObjectName',
    fixed: 'left',
  },
  {
    title: '报警内容',
    dataIndex: 'alarmContent',
  },
  {
    title: '报警开始时间',
    dataIndex: 'startTime',
    slots: { customRender: 'startTime' },
  },
  {
    title: '报警结束时间',
    dataIndex: 'endTime',
    slots: { customRender: 'endTime' },
  },
  {
    title: '报警持续时长',
    dataIndex: 'durationTime',
    slots: { customRender: 'durationTime' },
  },
];

export const repairForm: FormSchema[] = [
  {
    component: 'Input',
    label: '报警内容',
    field: 'alarmContent',
    show: false,
  },
  {
    component: 'Input',
    label: '报警 ID',
    field: 'alarmId',
    show: false,
  },
  {
    component: 'Input',
    label: '报警对象',
    field: 'alarmObject',
    show: false,
  },
  {
    component: 'InputNumber',
    label: 'Create User Id',
    field: 'createUserId',
    show: false,
    defaultValue: userId,
  },
  {
    component: 'InputNumber',
    label: '报警结束时间',
    field: 'endTime',
    show: false,
  },
  {
    component: 'Input',
    label: '报警类别',
    field: 'kind',
    show: false,
  },
  {
    component: 'Input',
    label: '报警级别',
    field: 'level',
    show: false,
  },
  {
    component: 'InputTextArea',
    label: '处理意见',
    labelWidth: 80,
    required: true,
    field: 'maintenanceOpinions',
    defaultValue: '',
  },
  {
    component: 'Input',
    label: '报警对象标识符',
    field: 'relativeObjectId',
    show: false,
  },
  {
    component: 'Input',
    label: '报警对象类型',
    field: 'relativeObjectType',
    show: false,
  },
  {
    component: 'Input',
    label: '报警开始时间',
    field: 'startTime',
    show: false,
  },
  {
    component: 'Input',
    label: 'Update User Id',
    field: 'updateUserId',
    show: false,
  },
  {
    component: 'Input',
    label: '报警内容版本号',
    field: 'versionTag',
    show: false,
  },
];

export const detailDesc: DescItem[] = [
  {
    label: '处理时间',
    field: 'handlingTime',
    render: (curVal) => {
      if (!curVal) {
        return '';
      } else {
        return formatToDateTime(curVal);
      }
    },
  },
  {
    label: '处理方式',
    field: 'optionStatus',
    render: (curVal) => {
      const alarmOptionsMap = {
        '1': '待处理',
        '2': '已处理',
        '3': '已报修',
        '4': '已关闭',
      };
      return alarmOptionsMap[curVal];
    },
  },
  {
    label: '处理人',
    field: 'handlingUserName',
  },
  {
    label: '处理意见',
    field: 'maintenanceOpinions',
    render: (curVal, data) => {
      return curVal ? curVal : data.handlingDesc;
    },
  },
];
