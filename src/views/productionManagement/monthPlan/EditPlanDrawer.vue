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

      <template #productionList="{ model, field }">
        {{ model[field] }}

        <BasicTable @register="registerTable" @edit-change="onEditChange">
          <template #action="{ record }">
            <TableAction :actions="createActions(record)" />
          </template>
        </BasicTable>

        <Row class="bg-white h-10 px-2">
          <Col :span="24" class="text-right">
            <a-button @click="handleAddRow" preIcon="ant-design:plus-outlined">
              添加输入行
            </a-button>
            <a-button class="ml-3" type="primary" :loading="loading" @click="handleSave">
              保存
            </a-button>
          </Col>
        </Row>
      </template>
    </BasicForm>

    <template #footer>
      <a-button :loading="loading" @click="save"> 保存 </a-button>
    </template>
  </BasicDrawer>
</template>

<script lang="ts" setup name="EditYearPlanDrawer">
  import { ref, onMounted, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { Select as ASelect, Row, Col } from 'ant-design-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getProductionListApi } from '/@/api/production/reportConfig';
  import { ProductionListSettingModel } from '/@/api/production/model/reportConfig';

  interface Record {
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
  const editId = ref<number | undefined>(undefined);
  const rateAccordingOptions = ref<RateAccordingOptions[]>([]);
  const loadingRateAccordingOptions = ref(false);

  const [registerForm, { getFieldsValue }] = useForm({
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
      {
        field: 'productionList',
        label: '',
        component: 'Input',
        slot: 'productionList',
      },
    ],
    labelWidth: 60,
    autoSubmitOnEnter: true,
    fieldMapToTime: [['timeRange', ['startDate', 'endDate'], 'x']],
  });

  const [registerTable, { setTableData, getDataSource, updateTableDataRecord }] = useTable({
    title: '表格中嵌套表单操作',
    titleHelpMessage: [
      '新增一行数据时必须添加数据中的标识唯一值字段（示例中为 id）以保证数据唯一性',
      '控制行数据变化的方法也是通过唯一标识字段（示例中为 id）来修改的',
    ],
    columns: [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        editRow: true,
        editRule: true,
      },
      {
        title: '姓名1',
        dataIndex: 'name1',
        helpMessage: '添加测试规则，不可以为三个字',
        width: 150,
        editRow: true,
        editRule: async (text) => {
          if (text.length === 3) {
            return '姓名1不能是三个字';
          }
          return '';
        },
      },
      {
        title: '姓名2',
        dataIndex: 'name2',
        editComponent: 'Select',
        editComponentProps: {
          options: [
            {
              label: 'Option1',
              value: '1',
            },
            {
              label: 'Option2',
              value: '2',
            },
            {
              label: 'Option3',
              value: '3',
            },
          ],
        },
        width: 150,
        editRow: true,
        editRule: true,
      },
      {
        title: '姓名3',
        dataIndex: 'name3',
        width: 150,
        editRow: true,
        editRule: true,
      },
      {
        title: '姓名4',
        dataIndex: 'name4',
        width: 150,
        editRow: true,
        editRule: true,
      },
      {
        title: '姓名5',
        dataIndex: 'name5',
        width: 150,
        editRow: true,
        editRule: true,
      },
      {
        title: '地址',
        dataIndex: 'address',
        editRow: true,
        editRule: true,
      },
    ],
    resizeHeightOffset: 40,
    pagination: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (record: Record) => {
    setDrawerProps({ loading: true });
    try {
      title.value =
        record.type === 'create'
          ? '新建生产计划'
          : record.type === 'edit'
          ? '编辑年度计划'
          : '查看年度计划';

      if (!record.recordId) return;
      editId.value = record.recordId;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  onMounted(async () => {
    try {
      loadingRateAccordingOptions.value = true;
      const data = await getProductionListApi();
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
      id: new Date().getTime(), // 新增的数据, 添加时间戳作为唯一值，在操作行数据时使用
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
        setTimeout(() => {
          loading.value = false;
          createMessage.success('保存成功, 打开控制台查看提交结果');
          const data = getDataSource().reduce((res, pre) => {
            res.push(cloneDeep(pre.editValueRefs));
            return res;
          }, [] as Recordable<any>[]);

          console.log('data :>> ', data);
        }, 2000);
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
    console.log('data :>> ', data);
  }
</script>
