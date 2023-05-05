import { FormSchema } from '/@/components/Form';
import { formatToDate } from '/@/utils/dateUtil';
import { useUserState } from '/@/hooks/web/useUserState';
import { useUserStoreWithOut } from '/@/store/modules/user';
import type { BasicColumn } from '/@/components/Table';
import { getSparePartTypesListApi } from '/@/api/info/sparePartType';
import { getVendorsListApi } from '/@/api/info/vendor';
import type { SparePartStockHistoryFullModel } from '/@/api/info/model/sparePartStocksModel';
import { dateUtil } from '/@/utils/dateUtil';
import { getSparePartDetailApi } from '/@/api/info/sparePart';
import { error } from '/@/utils/log';

const { getAllAccount } = useUserStoreWithOut();
const { getDictOptions, getDictMap } = useUserState();

const invTransReasonMap = getDictMap('INV_TRANS_REASON');

console.log('moduleMap :>> ', invTransReasonMap);

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
    field: 'timeRange',
    label: '时间',
    component: 'RangePicker',
    componentProps: {
      defaultPickerValue: [],
      format: 'YYYY-MM-DD',
    },
  },
  {
    field: 'typeId',
    label: '备件类型',
    component: 'ApiSelect',
    componentProps: {
      style: { width: '150px' },
      showSearch: true,
      api: getSparePartTypesListApi,
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
    },
  },
  {
    field: 'leadOutEmployeeIds',
    label: '领出人',
    component: 'Select',
    componentProps: {
      style: { width: '200px' },
      showSearch: true,
      placeholder: '请输入',
      options: getAllAccount,
      fieldNames: {
        label: 'name',
        value: 'realEmployeeId',
      },
      optionFilterProp: 'name',
    },
  },
  {
    field: 'vendorName',
    label: '厂商',
    component: 'ApiSelect',
    componentProps: ({ formModel }) => {
      return {
        style: { width: '300px' },
        showSearch: true,
        api: getVendorsListApi,
        params: {
          globalName: '',
          type: 'VENDOR_DEVICE',
        },
        resultField: 'items',
        labelField: 'name',
        valueField: 'id',
        immediate: true,
        onChange: (_value, option) => {
          console.log('option :>> ', option);
          formModel.vendorId = option.id;
        },
      };
    },
  },
  {
    field: 'vendorId',
    label: '',
    component: 'Input',
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: '日期',
    dataIndex: 'occurrenceDate',
    fixed: 'left',
    customRender: ({ text }: { text: SparePartStockHistoryFullModel['occurrenceDate'] }) => {
      return formatToDate(text);
    },
  },
  {
    title: '名称',
    dataIndex: 'sparePartName',
  },
  {
    title: '类型',
    dataIndex: 'sparePartTypeName',
  },
  {
    title: '入库/出库',
    dataIndex: 'type',
    customRender: ({ text }: { text: SparePartStockHistoryFullModel['type'] }) => {
      return text === 0 ? '出库' : '入库';
    },
  },
  {
    title: '事由',
    dataIndex: 'reason',
    customRender: ({ text }: { text: SparePartStockHistoryFullModel['reason'] }) => {
      return invTransReasonMap[text] || '';
    },
  },
  {
    title: '数量',
    dataIndex: 'stockNum',
    width: 90,
  },
  {
    title: '领出人',
    dataIndex: 'leadOutEmployeeName',
    width: 90,
  },
  {
    title: '厂商',
    dataIndex: 'vendorName',
    minWidth: 170,
  },
  {
    title: '备注',
    dataIndex: 'memo',
  },
  {
    title: '操作人',
    dataIndex: 'operatorName',
  },
];

export const editStockSchemas = (occurrenceType: 'out' | 'in'): FormSchema[] => {
  return [
    {
      field: 'occurrenceDate',
      label: '日期',
      component: 'DatePicker',
      required: true,
      defaultValue: dateUtil(),
      componentProps: {
        valueFormat: 'x',
      },
    },
    {
      field: 'sparePartId',
      label: '备件',
      component: 'ApiSelect',
      required: true,
      componentProps: ({ formActionType, formModel }) => {
        return {
          showSearch: true,
          api: getSparePartTypesListApi,
          resultField: 'items',
          labelField: 'name',
          valueField: 'id',
          immediate: true,
          onChange: async (id) => {
            if (!id) return;

            try {
              const { updateSchema } = formActionType;
              const { unit, vendorModels, stockNum } = await getSparePartDetailApi({ id });
              const unitMap = getDictMap('DT_UM');
              formModel.curStockNum = stockNum;
              // 更新 stockNum 字段后面的单位 和 vendorName 字段的下拉列表
              updateSchema([
                {
                  field: 'stockNum',
                  renderComponentContent: () => ({ addonAfter: () => unitMap[unit] }),
                },
                {
                  field: 'vendorName',
                  componentProps: { options: vendorModels || [] },
                },
              ]);
            } catch (err: any) {
              error(err);
            }
          },
        };
      },
    },
    {
      field: 'curStockNum',
      label: '当前库存',
      component: 'InputNumber',
      // 选择了备件才显示
      show: ({ model }) => model.sparePartId,
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'stockNum',
      label: occurrenceType === 'out' ? '出库数量' : '入库数量',
      component: 'InputNumber',
      dynamicRules: ({ values }) => {
        return [
          {
            required: true,
            validator: (_rules, value) => {
              if (!value) {
                const message = `请输入${occurrenceType === 'out' ? '出库' : '入库'}数量`;
                return Promise.reject(message);
              }
              if (value === values.curStockNum && occurrenceType === 'out') {
                return Promise.reject('结余库存不能为 0');
              }
              if (value > values.curStockNum && occurrenceType === 'out') {
                return Promise.reject('结余库存不能为负数');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },
    {
      field: 'leadOutEmployeeId',
      label: '领出人',
      show: occurrenceType === 'out',
      required: occurrenceType === 'out',
      component: 'Select',
      componentProps: {
        showSearch: true,
        options: getAllAccount,
        fieldNames: {
          label: 'name',
          value: 'realEmployeeId',
        },
        optionFilterProp: 'name',
      },
    },
    {
      field: 'reason',
      label: '事由',
      component: 'Select',
      componentProps: {
        options: getDictOptions('INV_TRANS_REASON'),
      },
    },
    {
      field: 'vendorName',
      label: '厂家',
      component: 'Select',
      componentProps: {
        showSearch: true,
        fieldNames: {
          label: 'name',
          value: 'id',
        },
        optionFilterProp: 'name',
      },
    },
    {
      field: 'memo',
      label: '备注',
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
    {
      field: 'versionTag',
      component: 'Input',
      label: '',
      show: false,
    },
  ];
};
