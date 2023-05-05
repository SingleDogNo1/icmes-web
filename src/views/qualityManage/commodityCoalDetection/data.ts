import { FormSchema } from '/@/components/Form';
import { dateUtil } from '/@/utils/dateUtil';
import { useUserState } from '/@/hooks/web/useUserState';
import type { BasicColumn } from '/@/components/Table';
import { remove, max, min } from 'lodash-es';
import type { EChartsOption } from 'echarts';
import { getProductionListApi, getAllProductionApi } from '/@/api/production/basic';
import { checkBatchNumberApi } from '/@/api/quality/commercialCoalInspection';
import {
  ProductionAdvanceModel,
  ProductionRelatedQualityQuotaModel,
} from '/@/api/production/model/basicModel';
import { error } from '/@/utils/log';

const { getDictOptions, getDictMap } = useUserState();
const directionOptions = getDictOptions('DT_PROD_CHECK_ DIREC');
const directionMap = getDictMap('DT_PROD_CHECK_ DIREC');
const coalTypeMap = getDictMap('DT_PROD_CHECK_MINE');
const coalTypeOptions = getDictOptions('DT_PROD_CHECK_MINE');

export const schemas: FormSchema[] = [
  {
    field: 'timeRange',
    label: '日期',
    component: 'RangePicker',
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
    componentProps: {
      buttonStyle: 'solid',
      options: directionOptions,
    },
  },
  {
    field: 'productionId',
    label: '产品',
    component: 'ApiSelect',
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
    title: '日期',
    dataIndex: 'inspectionDate',
    fixed: 'left',
    customRender: ({ record }) => {
      return dateUtil(record.inspectionDate).format('YYYY-MM-DD');
    },
  },
  {
    title: '矿别',
    dataIndex: 'coalType',
    customRender: ({ record }) => {
      return (
        coalTypeMap[record.loadingPlanBaseModel.coalType] ?? record.loadingPlanBaseModel.coalType
      );
    },
  },
  {
    title: '流向',
    dataIndex: 'direction',
    customRender: ({ record }) => {
      return directionMap[record.loadingPlanBaseModel.direction];
    },
  },
  {
    title: '产品',
    dataIndex: 'productionVariety',
    customRender: ({ record }) => {
      return record.loadingPlanBaseModel.productionVariety;
    },
  },
  {
    title: '发运量(T)',
    dataIndex: 'tonnage',
    customRender: ({ record }) => {
      return record.loadingPlanBaseModel.tonnage ?? '-';
    },
  },
  { title: '化验编号', dataIndex: 'batchNumber' },
  {
    title: '全水分Mt(%)',
    dataIndex: 'mt',
    customRender: ({ record }) => {
      return record.mt ?? '-';
    },
  },
  {
    title: '灰分Ad(%)',
    dataIndex: 'ad',
    customRender: ({ record }) => {
      return record.ad ?? '-';
    },
  },
  {
    title: '挥发分Vdaf(%)',
    dataIndex: 'vdaf',
    customRender: ({ record }) => {
      return record.vdaf ?? '-';
    },
  },
  {
    title: '全硫St,d(%)',
    dataIndex: 'std',
    customRender: ({ record }) => {
      return record.std ?? '-';
    },
  },
  {
    title: 'Qnet,ar(Cal/g)',
    dataIndex: 'qnetArCal',
    customRender: ({ record }) => {
      return record.qnetArCal ?? '-';
    },
  },
  {
    title: '质量区间',
    dataIndex: 'qualityRange',
    customRender: ({ record }) => {
      return record.qualityRange ?? '-';
    },
  },
  { title: '合格', dataIndex: 'qualified', slots: { customRender: 'qualified' } },
  { title: '稳定', dataIndex: 'stable', slots: { customRender: 'stable' } },
];

export const editCommercialCoalInspectionSchemas = (formData): FormSchema[] => {
  return [
    {
      field: 'inspectionDate',
      label: '日期',
      component: 'DatePicker',
      defaultValue: dateUtil().startOf('day'),
      required: true,
      componentProps: {
        valueFormat: 'x',
      },
    },
    {
      field: 'coalType',
      label: '矿别',
      component: 'Select',
      required: true,
      componentProps: {
        options: coalTypeOptions,
      },
    },
    {
      field: 'direction',
      label: '流向',
      component: 'Select',
      required: true,
      componentProps: {
        options: directionOptions,
      },
    },
    {
      field: 'productionId',
      label: '品种',
      component: 'ApiSelect',
      required: true,
      itemProps: { validateTrigger: 'blur' },
      componentProps: ({ formModel }) => {
        return {
          showSearch: true,
          api: getAllProductionApi,
          labelField: 'varieties',
          valueField: 'id',
          immediate: true,
          onOptionsReady: (options) => {
            // 只保留 type === 1 的煤种
            remove(options, (v: Record<string, number>) => v.type !== 1);
          },
          onChange: (_value, option: ProductionAdvanceModel) => {
            // 切换煤种，自动设置对应的质量区间
            const ashList = option.qualityQuotas.filter((v) => v.name === '灰分');
            const hotList = option.qualityQuotas.filter((v) => v.name === '发热量');

            function calcRange(list: ProductionRelatedQualityQuotaModel[]) {
              if (!list.length) return ''; // 没有质量区间，不显示

              if (list.length === 1) return list[0].operator.name + list[0].value; // 只有一个质量区间，直接显示

              if (list.length >= 2) {
                // 多个质量区间，显示最小值到最大值
                const rangeList = list.reduce((res, pre) => {
                  res.push(Number(pre.value));
                  return res;
                }, [] as number[]);
                return min(rangeList) + '-' + max(rangeList);
              }
            }

            // 选项中的 varieties 字段在设置里已经覆写为了 label，因此这里要取 label。同理，如果需要 id，应该使用 value
            formModel.qualityRange =
              (option as any).label === '精煤' ? calcRange(ashList) : calcRange(hotList);
          },
        };
      },
    },
    {
      field: 'tonnage',
      label: '发运量',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 99_9999_9999,
        controls: false,
      },
    },
    {
      field: 'batchNumber',
      label: '化验编号',
      component: 'Input',
      componentProps: ({ formModel, schema }) => {
        return {
          maxlength: 12,
          oninput: async () => {
            try {
              // TODO schema.suffix不支持使用组件, 该怎么添加loading状态？
              schema.suffix = 'loading...';
              const { data } = await checkBatchNumberApi({
                batchNumber: formModel.batchNumber,
                id: formData?.id as number,
              });
              schema.suffix = data ? '' : '未使用过的批号';
            } catch (err: any) {
              error(err);
            }
          },
        };
      },
    },
    {
      field: 'mt',
      label: '全水分Mt(%)',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 999.9,
        controls: false,
      },
    },
    {
      field: 'mad',
      label: '分析水Mad(%)',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'ad',
      label: '灰分Ad(%)',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'var',
      label: '挥发分Vd(%)',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'vdaf',
      label: '挥发分Vdaf(%)',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'cokeType',
      label: '焦渣特性',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 9,
        controls: false,
      },
    },
    {
      field: 'std',
      label: '全硫St,d(%)',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'qgrAd',
      label: 'Qgr,ad(MJ/Kg)',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'qgrD',
      label: 'Qgr,d(MJ/Kg)',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'qnetArMj',
      label: 'Qnet,ar(MJ/Kg)',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 999.99,
        controls: false,
      },
    },
    {
      field: 'qnetArCal',
      label: 'Qnet,ar(Cal/g)',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 9999,
        controls: false,
      },
    },
    {
      field: 'qualityRange',
      label: '质量区间',
      helpMessage: '选择品种后自动录入',
      component: 'Input',
      componentProps: {
        readonly: true,
        placeholder: '选择品种后自动录入',
      },
    },
    {
      field: 'memo',
      label: '备注',
      component: 'InputTextArea',
      componentProps: {
        maxlength: 50,
        showCount: true,
        autoSize: { minRows: 2, maxRows: 4 },
      },
    },
    // ------------- hidden fields -------------
    {
      field: 'loadingType',
      label: 'loadingType',
      component: 'InputNumber',
      defaultValue: 2,
      show: false,
    },
    {
      field: 'loadingPlanId',
      label: '装车计划号',
      component: 'InputNumber',
      show: false,
    },
    {
      field: 'versionTag',
      label: '版本号',
      component: 'InputNumber',
      show: false,
    },
  ];
};

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

export const exportExcelColumns = [
  {
    title: '序号',
    key: 'index',
  },
  {
    title: '日期',
    key: 'inspectionDate',
  },
  {
    title: '矿别',
    key: 'coalType',
  },
  {
    title: '流向',
    key: 'direction',
  },
  {
    title: '品种',
    key: 'productionVariety',
  },
  {
    title: '发运量（t）',
    key: 'tonnage',
  },
  {
    title: '化验编号',
    key: 'batchNumber',
  },
  {
    title: 'Mt(%)',
    key: 'mt',
  },
  {
    title: 'Mad(%)',
    key: 'mad',
  },
  {
    title: 'Ad(%)',
    key: 'ad',
  },
  {
    title: 'Vd(%)',
    key: 'var',
  },
  {
    title: 'Vdaf(%)',
    key: 'vdaf',
  },
  {
    title: '焦渣特性(1-8)',
    key: 'cokeType',
  },
  {
    title: 'St,d(%)',
    key: 'std',
  },
  {
    title: 'Qgr,ad(MJ/kg)',
    key: 'qgrAd',
  },
  {
    title: 'Qgr,d(MJ/kg)',
    key: 'qgrD',
  },
  {
    title: 'Qnet,ar(MJ/kg)',
    key: 'qnetArMj',
  },
  {
    title: 'Qnet,ar(cal/g)',
    key: 'qnetArCal',
  },
  {
    title: '质量区间',
    key: 'qualityRange',
  },
  {
    title: '备注',
    key: 'memo',
  },
];
