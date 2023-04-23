<template>
  <BasicDrawer v-bind="$attrs" :title="title" width="80%" show-footer @register="registerDrawer">
    <BasicForm @register="registerForm">
      <template #rateAccording="{ model, field }">
        <ASelect
          v-model:value="model[field]"
          allowClear
          mode="multiple"
          @change="handleChangeOption"
        >
          <ASelect.Option
            v-for="item in rateAccordingOptions"
            :key="item.id"
            :value="item.id"
            :disabled="item.disabled"
          >
            <span> {{ item.name }} </span>
          </ASelect.Option>
          <template #suffixIcon v-if="loadingRateAccordingOptions">
            <LoadingOutlined spin />
          </template>
          <template #notFoundContent v-if="loadingRateAccordingOptions">
            <span>
              <LoadingOutlined spin class="mr-1" />
              {{ t('component.form.apiSelectNotFound') }}
            </span>
          </template>
        </ASelect>
      </template>
    </BasicForm>

    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <Row class="bg-white h-10 px-2">
      <Col :span="24" class="text-right">
        <a-button block @click="handleAddRow" preIcon="ant-design:plus-outlined">
          添加输入行
        </a-button>
      </Col>
    </Row>

    <template #footer>
      <a-button :loading="loading" @click="save"> 保存 </a-button>
    </template>
  </BasicDrawer>
</template>

<script lang="ts" setup name="EditYearPlanDrawer">
  import { ref, unref, onMounted, nextTick } from 'vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { Select as ASelect, Row, Col } from 'ant-design-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getProductionListApi as getReportConfigListApi } from '/@/api/production/reportConfig';
  import { ProductionListSettingModel } from '/@/api/production/model/reportConfig';
  import { getProductionListApi } from '/@/api/production/basic';
  import { ProductionBaseModel } from '/@/api/production/model/basicModel';
  import { getProductionPlanApi, calcProductionPlanProductivityApi } from '/@/api/production/plan';

  interface RecordData {
    type: 'create' | 'edit' | 'view';
    recordId: Nullable<number>;
  }

  interface RateAccordingOptions extends Partial<ProductionListSettingModel> {
    disabled?: boolean;
  }

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const loading = ref(false);
  const title = ref('');
  const rateAccordingOptions = ref<RateAccordingOptions[]>([]);
  const loadingRateAccordingOptions = ref(false);
  const productionList = ref<ProductionBaseModel[]>([]);

  const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'code',
        label: '计划单号',
        component: 'Input',
      },
      {
        field: 'createTime',
        label: '开单日期',
        component: 'Input',
        defaultValue: dateUtil().format('YYYY-MM-DD'),
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'timeRange',
        component: 'RangePicker',
        label: '生产日期',
        required: true,
        componentProps: {
          format: 'YYYY-MM-DD',
          showTime: {
            defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
          },
        },
      },
      {
        field: 'rateAccording',
        label: '进度依据',
        component: 'ApiSelect',
        slot: 'rateAccording',
        helpMessage: '选填，将对应的产量报表的入洗总量与计划入洗总量进行对比',
      },
      {
        field: 'memo',
        label: '备注',
        component: 'InputTextArea',
        componentProps: {
          showCount: true,
          maxlength: 50,
        },
      },
    ],
    autoSubmitOnEnter: false,
    fieldMapToTime: [['timeRange', ['startDate', 'endDate'], 'x']],
  });

  const [registerTable, { setTableData, getDataSource, updateTableDataRecord }] = useTable({
    title: '计划入洗原煤和产出',
    resizeHeightOffset: 100,
    rowKey: 'key',
    columns: [
      {
        title: '产品',
        dataIndex: 'id',
        editComponent: 'ApiSelect',
        width: 250,
        editRow: true,
        editRule: async (text) => {
          if (!text) {
            return '请选择产品';
          }
          return '';
        },
        editComponentProps: ({ record, column, text, index }) => {
          return {
            api: getProductionListApi,
            resultField: 'items',
            valueField: 'id',
            allowClear: true,
            onOptionsReady: (options) => {
              productionList.value = options;
              const typeArr = ['原煤', '洗选产品', '其它'];
              options.forEach((option: ProductionBaseModel & { label: string }) => {
                option.label = `${option.varieties}(${typeArr[option.type]})`;
              });
              return options;
            },
            onSelect: (val, option) => {
              console.log(
                'val, record, column, text, index  :>> ',
                val,
                record,
                column,
                text,
                index,
              );
              const typeArr = ['原煤', '洗选产品', '其它'];
              record.editValueRefs.productType = typeArr[option.type];

              // upda
            },
          };
        },
      },
      // {
      //   title: '产品',
      //   dataIndex: 'id',
      //   editComponent: 'Select',
      //   width: 250,
      //   editRow: true,
      //   editRule: async (text) => {
      //     if (!text) {
      //       return '请选择产品';
      //     }
      //     return '';
      //   },
      //   editComponentProps: {
      //     options: [],
      //     onChange: (val, option) => {
      //       console.log('val,option :>> ', val, option);
      //     },
      //   },
      // },
      {
        title: '数量',
        dataIndex: 'amount',
        editComponentProps: ({ record, column, text, index }) => {
          console.log('record, column, text, index :>> ', record, column, text, index);
          return {
            addonAfter: '吨',
            onchange: async () => {
              const curRowOption = unref(productionList)[index];
              const { amount, ash, productivity } = record.editValueRefs;
              const form = {
                ...curRowOption,
                amount: amount || null,
                ash: ash || null,
                productivity: productivity || null,
                interfaceProduction: curRowOption.interfaceProduction || '',
              };
              console.log('val :>> ', form);
              // !只输入当前行数据进行查询会报错，必须查询表格所有数据才能正确查询
              const { items } = await calcProductionPlanProductivityApi({ items: [form] });
              console.log('items :>> ', items);
              record.editValueRefs.productivity = items[0].productivity;
            },
          };
        },
        width: 150,
        editRow: true,
        editRule: async (text) => {
          if (!text) {
            return '请输入数量';
          }
          return '';
        },
      },
      {
        title: '产率（%）',
        dataIndex: 'productivity',
        editComponentProps: {
          readonly: true,
          bordered: false,
          placeholder: '',
        },
        width: 150,
        editRow: true,
        editRule: true,
      },
      {
        title: '灰分（%）',
        dataIndex: 'ash',
        editComponent: 'InputNumber',
        editComponentProps: {
          controls: false,
          defaultValue: 2,
          min: 0,
          max: 100,
          precision: 2,
        },
        width: 150,
        editRow: true,
        editRule: true,
      },
      {
        title: '类型',
        dataIndex: 'productType',
        editComponentProps: {
          readonly: true,
          bordered: false,
          placeholder: '',
        },
        width: 150,
        editRow: true,
        editRule: true,
      },
    ],
    pagination: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (record: RecordData) => {
    setDrawerProps({ loading: true });
    try {
      title.value =
        record.type === 'create'
          ? '新建生产计划'
          : record.type === 'edit'
          ? '编辑年度计划'
          : '查看年度计划';

      if (!record.recordId) {
        // 新建
        reloadTable([
          {
            amount: null,
            ash: null,
            id: null,
            productivity: null,
            unit: '',
          },
        ]);
      } else {
        // 编辑 && 查看
        const data = await getProductionPlanApi(record.recordId);
        setFieldsValue({
          code: data.code,
          createTime: data.createTime,
          timeRange: [data.startDate, data.endDate],
          rateAccording: data.rateAccording,
          memo: data.memo,
        });

        const productionList = data.productionList as unknown as Record<string, string>[];

        productionList.forEach((v) => {
          const typeArr = ['原煤', '洗选产品', '其它'];
          v.productType = typeArr[v.type];
        });

        reloadTable(data.productionList);
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  onMounted(async () => {
    try {
      loadingRateAccordingOptions.value = true;
      const data = await getReportConfigListApi();
      const options = (data || []).filter((v) => v.useful);

      rateAccordingOptions.value = [{ id: -1, name: '全部产量报表' }, ...options];
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loadingRateAccordingOptions.value = false;
    }
  });

  function handleChangeOption(data: number[]) {
    if (!data.length) {
      rateAccordingOptions.value.forEach((val) => {
        val.disabled = false;
      });
    } else if (data.includes(-1)) {
      rateAccordingOptions.value.forEach((val) => {
        if (val.id !== -1) {
          val.disabled = true;
        }
      });
    } else {
      rateAccordingOptions.value.forEach((val) => {
        if (val.id === -1) {
          val.disabled = true;
        }
      });
    }
  }

  function onEditChange({ column, value, record }) {
    record.editValueRefs[column.dataIndex].value = value;
  }

  function createActions(record): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，请问确认删除数据？',
          confirm: () => {
            const data = getDataSource();
            const index = data.findIndex((v) => v.id === record.id);
            data.splice(index, 1);
            reloadTable(data);
          },
        },
      },
    ];
  }

  async function handleAddRow() {
    const data = getDataSource();
    data.push({
      name: null,
      name1: null,
      name2: null,
      name3: null,
      name4: null,
      name5: null,
      address: null,
      id: null,
    });

    reloadTable(data);
  }

  async function handleSave() {
    const validRows = getDataSource().reduce((res, pre) => {
      res.push(valid(pre));
      return res;
    }, [] as Promise<any>[]) as Promise<any>[];

    Promise.all(validRows).then((data: boolean[]) => {
      const valid = data.reduce((res, pre) => {
        res = res && pre;
        return res;
      }, true);

      // mock 提交数据
      if (valid) {
        loading.value = true;
        loading.value = false;
        createMessage.success('保存成功, 打开控制台查看提交结果');
        const data = getDataSource().reduce((res, pre) => {
          res.push(cloneDeep(pre.editValueRefs));
          return res;
        }, [] as Recordable<any>[]);

        console.log('data :>> ', data);
      }
    });
  }

  async function reloadTable(data) {
    setTableData(data);
    await nextTick();
    getDataSource().map((v) => {
      v.onEdit(true);
    });
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

  function save() {
    const data = getFieldsValue();
    const tableData = getDataSource();

    handleSave();

    console.log('data :>> ', data, tableData);
  }
</script>
