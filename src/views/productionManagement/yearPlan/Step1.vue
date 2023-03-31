<template>
  <BasicForm @register="register" />

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
</template>

<script lang="ts" setup name="EditYearPlanStep1">
  import { BasicForm, useForm } from '/@/components/Form';
  import { nextTick, watch, unref } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { ProductionBaseModel } from '/@/api/production/model/basicModel';
  import { ProductionYearPlanMonthFullModel } from '/@/api/production/model/yearPlanModel';
  import { step1Schemas } from './data';

  interface MonthDetailData {
    year: string;
    memo: ProductionYearPlanMonthFullModel['memo'];
    monthProductions: ProductionYearPlanMonthFullModel['monthProductions'];
  }

  const props = defineProps<{
    monthDetailsData: MonthDetailData | null;
    productionList: ProductionBaseModel[];
  }>();

  const [register, { validate: validateForm, getFieldsValue, setFieldsValue, resetFields }] =
    useForm({
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
          },
        },
        { field: 'memo', component: 'InputTextArea', label: '备注说明' },
      ],
      showActionButtonGroup: false,
    });

  const [registerTable, { setTableData, getDataSource, updateTableDataRecord, updateColumn }] =
    useTable({
      title: '年计划产品',
      columns: step1Schemas(unref(props.productionList)),
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

      return {
        ...formData,
        ...{ productions: tableData },
      };
    } catch (error: any) {
      throw new Error(error);
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
