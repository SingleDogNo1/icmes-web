import { FormSchema } from '/@/components/Form';
import { dateUtil } from '/@/utils/dateUtil';
import { useUserState } from '/@/hooks/web/useUserState';
import type { BasicColumn } from '/@/components/Table';
import type { EChartsOption } from 'echarts';
import { getProductionListApi } from '/@/api/production/basic';

const { getDictOptions } = useUserState();
const directionOptions = getDictOptions('DT_PROD_CHECK_ DIREC');

export const schemas: FormSchema[] = [
  {
    field: 'timeRange',
    label: '日期',
    component: 'RangePicker',
    colProps: { span: 8 },
    // defaultValue: [dateUtil().startOf('month'), dateUtil().endOf('day')],
    defaultValue: [dateUtil('2022-03-01').startOf('month'), dateUtil('2022-05-31').endOf('day')],
    componentProps: {
      format: 'YYYY-MM-DD',
      showTime: {
        defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
      },
    },
  },
  {
    field: 'direction',
    label: '流向',
    component: 'RadioButtonGroup',
    colProps: { span: 8 },
    componentProps: {
      buttonStyle: 'solid',
      options: directionOptions,
    },
  },
  {
    field: 'productionId',
    label: '产品',
    component: 'ApiSelect',
    colProps: { span: 8 },
    componentProps: {
      showSearch: true,
      api: getProductionListApi,
      params: {
        ascending: true,
        orderBy: '',
        productionId: '',
        typeArr: [1],
      },
      resultField: 'items',
      labelField: 'varieties',
      valueField: 'id',
      immediate: true,
    },
  },
  {
    field: 'batchNumber',
    label: '化验编号',
    component: 'Input',
    componentProps: {
      maxlength: 12,
    },
  },
  {
    field: 'unqualified',
    label: '不合格',
    component: 'Checkbox',
  },
  {
    field: 'unstable',
    label: '不稳定',
    component: 'Checkbox',
  },
  // --------------- hidden fields ---------------
  {
    field: 'ascending',
    label: '升序',
    component: 'Checkbox',
    defaultValue: false,
    show: false,
  },
  {
    field: 'orderBy',
    label: '排序字段',
    component: 'Input',
    defaultValue: 'inspectionDate',
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
    defaultValue: 0,
    show: false,
  },
  {
    field: 'status',
    label: '审核状态',
    component: 'Input',
    defaultValue: '',
    show: false,
  },
  {
    field: 'loadingType',
    label: '运输方式',
    component: 'InputNumber',
    defaultValue: 2,
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: '功能模块',
    dataIndex: 'module',
    slots: { customRender: 'module' },
    fixed: 'left',
    width: 200,
  },
  {
    title: '操作类型',
    dataIndex: 'operate',
    slots: { customRender: 'operate' },
    width: 125,
  },
  {
    title: '日志内容',
    dataIndex: 'content',
    slots: { customRender: 'content' },
  },
  {
    title: '操作用户',
    dataIndex: 'operator',
    width: 120,
  },
  {
    title: '操作时间',
    dataIndex: 'time',
    slots: { customRender: 'time' },
    width: 150,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    width: 130,
  },
  {
    title: '终端信息',
    dataIndex: 'terminalInfo',
    width: 130,
  },
  {
    title: '终端类型',
    dataIndex: 'terminalType',
    slots: { customRender: 'terminalType' },
    width: 120,
  },
];

export const basicEchartsOptions: EChartsOption = {
  backgroundColor: '#fff',
  grid: {
    top: '20%',
    left: '16px',
    right: '16px',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  yAxis: [{ type: 'value' }],
};
