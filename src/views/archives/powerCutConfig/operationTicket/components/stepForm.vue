<template>
  <div>
    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <Row class="bg-white h-10 px-2">
      <Col class="text-right">
        <a-button @click="handleAddRow">
          <template #icon>
            <PlusOutlined />
          </template>
          添加输入行
        </a-button>
        <a-button class="ml-3" type="primary" :loading="loading" @click="handleSave">保存</a-button>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, nextTick, toRefs, unref, watch } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicTable, useTable, TableAction, BasicColumn, ActionItem } from '/@/components/Table';
  import { HvOperationTemplateStepModel } from '/@/api/power/model/hvOperationModel';

  const props = defineProps({
    ticket: {
      type: Array as PropType<HvOperationTemplateStepModel[]>,
      required: true,
    },
    type: {
      type: String as PropType<'cut' | 'supply'>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['save']);

  const { ticket, type } = toRefs(props);
  const columns: BasicColumn[] = [
    {
      title: '序号',
      dataIndex: 'order',
      editRow: true,
      editRule: true,
      editComponent: 'InputNumber',
      width: 100,
    },
    {
      title: '步骤',
      dataIndex: 'step',
      editRow: true,
      editRule: true,
    },
  ];
  const [registerTable, { setTableData, getDataSource, updateTableDataRecord, setProps }] =
    useTable({
      columns: columns,
      showIndexColumn: false,
      pagination: false,
      resizeHeightOffset: 40,
      actionColumn: {
        width: 100,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
      },
    });

  // TODO 更新数据之后，为什么不触发监听？
  watch(props.ticket, (val) => {
    console.log('val :>> ', val);
    reloadTable(val);
  });

  onMounted(async () => {
    const data = unref(ticket);
    const ticket_type = unref(type);

    setProps({ title: `${ticket_type === 'cut' ? '停' : '送'}电操作步骤` });

    reloadTable(data);
  });

  function createActions(record): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，请问确认删除数据？',
          confirm: () => {
            const data = getDataSource();
            const index = data.findIndex((v) => v.key === record.key);
            console.log('record :>> ', index);
            data.splice(index, 1);
            reloadTable(data);
          },
        },
      },
    ];
  }

  function onEditChange({ column, value, record }) {
    record.editValueRefs[column.dataIndex].value = value;
  }

  async function handleAddRow() {
    const data = getDataSource();
    data.push({
      order: null,
      step: '',
      key: new Date().getTime(), // 新增的数据, 添加时间戳作为唯一值，在操作行数据时使用
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
      if (valid) {
        emit('save', getDataSource());
      }
    });
  }

  async function valid(record) {
    const valid = await record.onValid?.();
    if (valid) {
      const data = cloneDeep(record.editValueRefs);
      updateTableDataRecord(record.key, data);
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise((resolve) => resolve(false));
    }
  }
</script>
