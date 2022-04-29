import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { useUserState } from '/@/hooks/web/useUserState';
import { PointTypeEnum } from '/@/api/info/model/plcPointsModel';

const { getDictOptions } = useUserState();

const businessTypeOptions = getDictOptions('DT_PLC_BUSINESS_TYPE');
const unitOptions = getDictOptions('DT_UM');

const pointTypeOptions: { [index: string]: number | string }[] = [
  { label: '数字量', value: 0 },
  { label: '模拟量', value: 1 },
  { label: '控制量', value: 2 },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'code',
    label: '点位编码',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'pointType',
    label: '点位类型',
    component: 'Select',
    defaultValue: '',
    componentProps: {
      style: { width: '200px' },
      options: [{ label: '全部', value: '' }, ...pointTypeOptions],
    },
  },
  // ------------------------------- hidden fields -------------------------------
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
];

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    slots: { customRender: 'name' },
    fixed: 'left',
  },
  {
    title: '点位编码',
    dataIndex: 'code',
  },
  {
    title: '点位类型',
    dataIndex: 'pointType',
    slots: { customRender: 'pointType' },
  },
  {
    title: '点位内容',
    dataIndex: 'pointContent',
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    slots: { customRender: 'businessType' },
  },
  {
    title: '单位',
    dataIndex: 'unit',
    slots: { customRender: 'unit' },
  },
];

export const UpdateSignalAttrSchemas: FormSchema[] = [
  {
    field: 'pointContent',
    label: '点位内容',
    required: true,
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
      options: [
        { value: '系统状态监测', label: '（调度日志）' },
        { value: '流量计', label: '（能耗记录-水）' },
        { value: '电表高位', label: '（能耗记录-电）' },
        { value: '电表低位', label: '（能耗记录-电）' },
        { value: '自动加药', label: '（能耗记录-药剂）' },
        { value: '自动加介', label: '（能耗记录-介质）' },
        { value: '风流量', label: '（能耗记录-风）' },
        { value: '料位计', label: '（煤仓）' },
        { value: '清水', label: '（浓缩机-清水）' },
        { value: '阻力', label: '（浓缩机-阻力）' },
        { value: '分选比重实时', label: '（生产情况分析）' },
        { value: '分选比重设定', label: '（生产情况分析）' },
        { value: '入浮流量', label: '（生产情况分析）' },
        { value: '入浮密度', label: '（生产情况分析）' },
        { value: '噪声报警', label: '（环保管理）' },
        { value: '粉尘报警', label: '（环保管理）' },
        { value: '带煤量', label: '（产量报表/运行统计）' },
        { value: '皮带带煤检测', label: '（运行统计）' },
        { value: '设备状态检测', label: '（停送电/运行统计）' },
      ],
    },
  },
  {
    field: 'businessType',
    label: '业务类型',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
      options: businessTypeOptions,
    },
  },
  {
    field: 'needStoraged',
    label: '是否需要存储',
    component: 'Switch',
    defaultValue: false,
  },
  {
    field: 'deviceMonitorFlag',
    label: '是否在设备档案里显示',
    component: 'Switch',
    defaultValue: false,
  },
  {
    field: 'orderNum',
    label: '在设备档案里的显示顺序',
    show: ({ values }) => {
      return !!values.deviceMonitorFlag;
    },
    dynamicRules: ({ values }) => {
      return values.deviceMonitorFlag ? [{ required: true, message: '请输入显示顺序' }] : [];
    },
    component: 'InputNumber',
    componentProps: {
      controls: false,
      min: 1,
      max: 999,
    },
  },
  {
    field: 'pointType',
    label: '点位类型',
    component: 'Select',
    componentProps: ({ formModel }) => {
      return {
        getPopupContainer: () => document.body,
        options: pointTypeOptions,
        onChange: (val: PointTypeEnum) => {
          if (val !== PointTypeEnum['NUMBER']) {
            // 切换点位类型不为数字类型，清除数字量字段的绑定值
            formModel.digitalOneComment = null;
            formModel.digitalZeroComment = null;
          }
          if (val !== PointTypeEnum['SIMULATION']) {
            // 切换点位类型不为模拟量，清除模拟量单位字段的绑定值
            formModel.unit = null;
          }
        },
      };
    },
  },
  {
    field: 'digitalOneComment',
    label: '数字量1的含义',
    component: 'Input',
    show: ({ values }) => {
      return !!(values.pointType === PointTypeEnum['NUMBER']);
    },
    dynamicRules: ({ values }) => {
      return values.pointType === PointTypeEnum['NUMBER']
        ? [{ required: true, message: '请输入数字量1的含义' }]
        : [];
    },
    componentProps: {
      maxlength: 4,
    },
  },
  {
    field: 'digitalZeroComment',
    label: '数字量0的含义',
    component: 'Input',
    show: ({ values }) => {
      return !!(values.pointType === PointTypeEnum['NUMBER']);
    },
    dynamicRules: ({ values }) => {
      return values.pointType === PointTypeEnum['NUMBER']
        ? [{ required: true, message: '请输入数字量0的含义' }]
        : [];
    },
    componentProps: {
      maxlength: 4,
    },
  },
  {
    field: 'unit',
    label: '单位',
    component: 'Select',
    show: ({ values }) => {
      return !!(values.pointType === PointTypeEnum['SIMULATION']);
    },
    dynamicRules: ({ values }) => {
      return values.pointType === PointTypeEnum['SIMULATION']
        ? [{ required: true, message: '请选择单位' }]
        : [];
    },
    componentProps: {
      getPopupContainer: () => document.body,
      options: unitOptions,
    },
  },
  {
    field: 'ratedValue',
    label: '额定值',
    component: 'Input',
    componentProps: {
      maxlength: 10,
    },
  },
];
