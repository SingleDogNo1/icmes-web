import { readonly } from 'vue';
import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { useUserState } from '/@/hooks/web/useUserState';
import { getStrategyListApi } from '/@/api/info/strategy';

const { getDictOptions, getDictMap } = useUserState();

const powerBusinessNodeOptions = getDictOptions('POWER_BUSINESS_NODE');
const powerBusinessNodeMap = getDictMap('POWER_BUSINESS_NODE');
const powerCutFailTipOptions = getDictOptions('POWER_BUSINESS_NODE');
const powerCutFailTipMap = getDictMap('BT_POWER_CUT_FAILTIP');
// TODO PLC检测类型是否考虑放在数据字典中？
const plcDetectTypeOptions = readonly([
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
    value: 5,
    label: '参与停送电流程，无电工配电操作',
  },
  {
    value: 6,
    label: '不参与停送电流程',
  },
  {
    value: 7,
    label: '监测运行状态+带电状态+就地状态',
  },
]);

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
    defaultValue: '',
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
    field: 'powerBusinessNode',
    label: '业务节点',
    component: 'Select',
    componentProps: {
      style: { width: '200px' },
      options: powerBusinessNodeOptions,
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '业务节点',
    dataIndex: 'powerBusinessNode',
    customRender: ({ record }) => {
      return `${powerBusinessNodeMap[record.powerBusinessNode]}`;
    },
  },
  {
    title: 'PLC监测类型',
    dataIndex: 'plcDetectTypeName',
    customRender: ({ record }) => {
      const label = plcDetectTypeOptions.filter((v) => v.value === record.plcDetectType)[0].label;
      return label;
    },
  },
  {
    title: '策略规则',
    dataIndex: 'strategyRules',
    customRender: ({ record }) => {
      return `${record.strategyNumber} ${record.strategyName}`;
    },
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '校验未通过说明',
    dataIndex: 'explain',
    customRender: ({ record }) => {
      return powerCutFailTipMap[record.explain];
    },
  },
  {
    title: '不监测PLC提示',
    dataIndex: 'unSupervisePlcTip',
    slots: { customRender: 'unSupervisePlcTip' },
  },
  {
    title: '启用/停用',
    dataIndex: 'inuse',
    slots: { customRender: 'inuse' },
  },
];

export const editPLCJudgmentRulesSchema: FormSchema[] = [
  {
    field: 'powerBusinessNode',
    label: '业务节点',
    component: 'Select',
    required: true,
    componentProps: {
      options: powerBusinessNodeOptions,
    },
  },
  {
    field: 'plcDetectType',
    label: 'PLC监测类型',
    component: 'Select',
    required: true,
    componentProps: {
      options: plcDetectTypeOptions,
    },
  },
  {
    field: 'strategyId',
    label: '策略规则',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: getStrategyListApi,
      params: {
        ascending: false,
        pageNo: 0,
        pageSize: 0,
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
      onOptionsReady: (options) => {
        options.forEach((v) => {
          v.name = v.number + ' ' + v.name;
          v.disabled = !v.isUse;
        });
      },
    },
  },
  {
    field: 'explain',
    label: '校验未通过说明',
    component: 'Select',
    required: true,
    componentProps: {
      options: powerCutFailTipOptions,
    },
  },
  {
    field: 'description',
    label: '描述',
    component: 'InputTextArea',
    componentProps: {
      showCount: true,
      maxlength: 100,
      autoSize: {
        minRows: 2,
        maxRows: 5,
      },
    },
  },
];
