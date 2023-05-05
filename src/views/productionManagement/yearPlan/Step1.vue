<template>
  <div>
    <BasicForm @register="registerForm" />

    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <Row class="bg-white h-8 px-2">
      <Col :span="24" class="text-right">
        <a-button block type="dashed" @click="handleAddRow" preIcon="ant-design:plus-outlined">
          添加输入行
        </a-button>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup name="EditYearPlanStep1">
  import { BasicForm, useForm } from '/@/components/Form';
  import { nextTick, watch, unref } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { ProductionBaseModel } from '/@/api/production/model/basicModel';
  import { ProductionYearPlanMonthFullModel } from '/@/api/production/model/yearPlanModel';
  import { getyearPlansListApi } from '/@/api/production/yearPlan';
  import { error } from '/@/utils/log';

  interface MonthDetailData {
    year: string;
    memo: ProductionYearPlanMonthFullModel['memo'];
    monthProductions: ProductionYearPlanMonthFullModel['monthProductions'];
  }

  const props = defineProps<{
    monthDetailsData: MonthDetailData | null;
    productionList: ProductionBaseModel[];
    editId: number | undefined;
  }>();

  const [
    registerForm,
    { validate: validateForm, getFieldsValue, setFieldsValue, resetFields, updateSchema },
  ] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'year',
        component: 'DatePicker',
        label: '生产年度',
        required: true,
        componentProps: {
          picker: 'year',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          disabled: !!props.editId,
        },
        rules: [
          {
            required: true,
            validator: async (_rule, value: string) => {
              try {
                const { items } = await getyearPlansListApi({ pageNo: 0, pageSize: 0 });
                if (!items || !items.length) {
                  return Promise.resolve();
                } else {
                  const item = items.find((v) => v.year === ~~dateUtil(value).format('YYYY'));
                  if (item) {
                    return Promise.reject('已有年度计划，请重新选择');
                  } else {
                    return Promise.resolve();
                  }
                }
              } catch (error) {
                return Promise.reject('未知错误');
              }
            },
            trigger: 'change',
          },
        ],
      },
      { field: 'memo', component: 'InputTextArea', label: '备注说明' },
    ],
    showActionButtonGroup: false,
  });

  const [registerTable, { setTableData, getDataSource, updateTableDataRecord, updateColumn }] =
    useTable({
      title: '年计划产品',
      columns: [
        {
          title: '产品',
          dataIndex: 'productionId',
          editComponent: 'Select',
          editRow: true,
          editRule: async (text) => {
            if (!text) {
              return '产品不能为空';
            }
            return '';
          },
          editComponentProps: {
            style: {
              width: '100%',
            },
          },
        },
        {
          title: '类型2',
          dataIndex: 'productType',
          editRow: true,
          // TODO 通过 ifShow 隐藏字段后，修改字段值不生效. 目前通过 width: 0 保证既存在字段有不可见，有什么更好的办法？？？
          width: 0,
          // ifShow: false
        },
        {
          title: '产品名',
          dataIndex: 'varieties',
          editRow: true,
          // TODO 通过 ifShow 隐藏字段后，修改字段值不生效. 目前通过 width: 0 保证既存在字段有不可见，有什么更好的办法？？？
          width: 0,
        },
        {
          title: '产品分组',
          dataIndex: 'productionGroup',
          editRow: true,
          // TODO 通过 ifShow 隐藏字段后，修改字段值不生效. 目前通过 width: 0 保证既存在字段有不可见，有什么更好的办法？？？
          width: 0,
        },
        {
          title: '产品品种',
          dataIndex: 'productVarieties',
          editRow: true,
          // TODO 通过 ifShow 隐藏字段后，修改字段值不生效. 目前通过 width: 0 保证既存在字段有不可见，有什么更好的办法？？？
          width: 0,
        },
        {
          title: '类型',
          dataIndex: 'productTypeText',
          editRow: true,
          editComponentProps: {
            readonly: true,
            bordered: false,
            placeholder: '请选择产品',
          },
        },
        {
          title: '灰分(%)',
          dataIndex: 'ash',
          editRow: true,
        },
        {
          title: '水分(%)',
          dataIndex: 'moisture',
          editRow: true,
        },
        {
          title: '发热量(大卡)',
          dataIndex: 'mj',
          editRow: true,
        },
        {
          title: '计划产率(%)',
          dataIndex: 'productivity',
          helpMessage: '洗选产品必填',
          editRow: true,
          editRule: async (text, record) => {
            const productionId = record.editValueRefs.productionId;
            const productionList = unref(props.productionList);
            const currentRow = productionList.find((v) => v.id === productionId);
            // 当前行数据产品如果是原煤，不能输入计划产率，所以不校验
            if (currentRow?.type === 0) {
              return '';
            } else if (!text) {
              return '请输入计划产率';
            } else {
              return '';
            }
          },
          editComponentProps: ({ record }) => {
            const productionId = record.editValueRefs.productionId;
            const productionList = unref(props.productionList);
            const currentRow = productionList.find((v) => v.id === productionId);
            // 当前行数据产品如果是原煤，输入框不能输入，视觉上也不可见 (readonly, 去除边框)
            return {
              readonly: currentRow?.type === 0,
              bordered: currentRow?.type !== 0,
              placeholder: '',
            };
          },
        },
      ],
      resizeHeightOffset: 90,
      pagination: false,
      actionColumn: {
        width: 100,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
      },
    });

  watch(
    () => props.monthDetailsData,
    async (value) => {
      value?.year && setFieldsValue({ year: value.year, memo: value.memo });
      value?.monthProductions && reloadTable(value.monthProductions);
      await nextTick();
      renderProductionOptions();
    },
  );

  watch(
    () => props.productionList,
    (productions) => {
      const options = productions.map((v) => {
        return {
          label: `${v.varieties} ${v.spec ? v.spec : ''} ${v.type === 0 ? '(原煤)' : '(洗选产品)'}`,
          value: v.id,
        };
      });
      updateColumn({ dataIndex: 'productionId', editComponentProps: { options } });
    },
  );

  // editId 有变化，说明是编辑操作，编辑时不校验年份是否存在 && 年份不可操作
  watch(
    () => props.editId,
    (value) => {
      console.log('value :>> ', value);
      updateSchema({
        field: 'year',
        componentProps: {
          disabled: !!value,
        },
        rules: [
          {
            required: !!value,
            validator: async (_rule, value: string) => {
              try {
                const { items } = await getyearPlansListApi({ pageNo: 0, pageSize: 0 });
                if (value) {
                  return Promise.resolve();
                } else {
                  if (!items || !items.length) {
                    return Promise.resolve();
                  } else {
                    const item = items.find((v) => v.year === ~~dateUtil(value).format('YYYY'));
                    if (item) {
                      return Promise.reject('已有年度计划，请重新选择');
                    } else {
                      return Promise.resolve();
                    }
                  }
                }
              } catch (error) {
                return Promise.reject('未知错误');
              }
            },
            trigger: 'change',
          },
        ],
      });
    },
  );

  function createActions(record): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        onClick: () => {
          const data = getDataSource();
          const index = data.findIndex((v) => v.id === record.id);
          data.splice(index, 1);
          reloadTable(data);
        },
      },
    ];
  }

  /* 数据发生变化时，重设产品下拉列表选项的 disable 状态 */
  function renderProductionOptions() {
    const tableData = getDataSource().reduce((res, pre) => {
      res.push(cloneDeep(pre.editValueRefs));
      return res;
    }, [] as Recordable<any>[]);

    const selectedProducts = tableData.reduce((res, pre) => {
      res.push(pre.productionId);
      return res;
    }, [] as number[]);

    const productionList = unref(props.productionList);

    const options = productionList.map((v) => {
      return {
        label: `${v.varieties} ${v.spec ? v.spec : ''} ${v.type === 0 ? '(原煤)' : '(洗选产品)'}`,
        value: v.id,
        disabled: selectedProducts.includes(v.id),
      };
    });
    updateColumn({ dataIndex: 'productionId', editComponentProps: { options } });
  }

  function onEditChange({ column, value, record }) {
    record.editValueRefs[column.dataIndex].value = value;
    const item = props.productionList.find((v) => v.id === value);
    if (column.dataIndex === 'productionId') {
      record.editValueRefs['varieties'].value = item?.varieties ?? '';
      record.editValueRefs['productVarieties'].value = item?.varieties ?? '';
      record.editValueRefs['productionGroup'].value = item?.productionGroup ?? '';
      record.editValueRefs['productType'].value = item?.type;
      record.editValueRefs['productTypeText'].value = item?.type === 0 ? '原煤' : '洗选产品';
    }

    renderProductionOptions();
  }

  async function handleAddRow() {
    const data = getDataSource();
    data.push({
      id: new Date().getTime(), // 新增的数据, 添加时间戳作为唯一值，在操作行数据时使用
      productionId: null,
      type: null,
      ash: null,
      moisture: null,
      mj: null,
      productivity: null,
    });

    reloadTable(data);
  }

  // 表格数据变动，重新渲染表格并设置为编辑模式
  async function reloadTable(data) {
    setTableData(data);
    await nextTick();
    getDataSource().map((v) => {
      v.onEdit(true);
    });
  }

  async function saveTableData() {
    const validRows = getDataSource().reduce((res, pre) => {
      res.push(valid(pre));
      return res;
    }, [] as Promise<boolean>[]) as Promise<boolean>[];

    const data = await Promise.all(validRows);

    const isValid = data.reduce((res, pre) => {
      res = res && pre;
      return res;
    }, true);
    if (isValid) {
      return getDataSource();
    }
  }

  async function valid(record) {
    const valid = await record.onValid?.();
    if (valid) {
      const data = cloneDeep(record.editValueRefs);
      updateTableDataRecord(record.id, data);
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise((resolve) => resolve(false));
    }
  }

  async function handleSubmit() {
    try {
      await validateForm();
      const formData = getFieldsValue();

      const tableDataSource = await saveTableData();
      if (!tableDataSource || !tableDataSource.length) return;
      const tableData = tableDataSource.reduce((res, pre) => {
        res.push(cloneDeep(pre.editValueRefs));
        return res;
      }, [] as Recordable<any>[]);

      console.log('tableData :>> ', tableData);
      return {
        ...formData,
        ...{ productions: tableData },
      };
    } catch (err: any) {
      error(err);
    }
  }

  function resetForm() {
    resetFields();
    reloadTable([]);
  }

  defineExpose({
    submit: handleSubmit,
    reset: resetForm,
  });
</script>
